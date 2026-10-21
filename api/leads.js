const admin = require('firebase-admin');
function getDb() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!projectId || !clientEmail || !privateKey) throw new Error('Firebase credentials missing');
    admin.initializeApp({credential: admin.credential.cert({projectId,clientEmail,privateKey})});
  }
  return admin.firestore();
}
const field = (value,max=200) => typeof value === 'string' ? value.trim().slice(0,max) : '';
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
    if(!body || typeof body!=='object' || JSON.stringify(body).length>10000) return res.status(400).json({error:'Invalid request'});
    if(body.website) return res.status(200).json({ok:true});
    const lead={
      name:field(body.name,120),phone:field(body.phone,40),email:field(body.email,254),
      city:field(body.city,120),property:field(body.property,40),
      fiber:field(body.fiber,5),solar:field(body.solar,5),
      speed:field(body.speed,40),nodes:field(body.nodes,10),
      language:body.language==='he'?'he':'en',status:'new',source:'gridnest-landing',
      createdAt:admin.firestore.FieldValue.serverTimestamp()
    };
    // All form fields are stored as strings; do not restrict translated values to English enums.
    if (!lead.name || !lead.phone || !lead.email || !lead.city ||
        !lead.property || !lead.fiber || !lead.solar || !lead.speed || !lead.nodes)
      return res.status(400).json({error:'Please complete all form fields'});
    const doc=await getDb().collection('gridnest_leads').add(lead);
    if(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_FROM){
      try{
        const response=await fetch('https://api.resend.com/emails',{
          method:'POST',
          headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
          body:JSON.stringify({
            from:process.env.LEAD_NOTIFICATION_FROM,
            to:['davidon6996@gmail.com'],
            subject:'New GridNest lead: '+lead.name,
            text:Object.entries({...lead,createdAt:new Date().toISOString(),id:doc.id}).map(([key,value])=>key+': '+value).join('\n')
          })
        });
        if(!response.ok) console.error('Notification delivery failed',response.status);
      }catch(error){console.error('Notification delivery error',error.message);}
    }
    return res.status(201).json({ok:true});
  }catch(error){
    console.error('GridNest lead error',error.message);
    return res.status(503).json({error:'Registration is temporarily unavailable'});
  }
};
