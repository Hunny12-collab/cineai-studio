import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { fal } from '@fal-ai/client';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:25*1024*1024}});

app.use(express.static(path.join(__dirname,'public')));
app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/generate',upload.single('image'),async(req,res)=>{
  try{
    if(!process.env.FAL_KEY) return res.status(500).json({error:'FAL_KEY server par set nahi hai.'});
    if(!req.file) return res.status(400).json({error:'Image required.'});
    const mime=req.file.mimetype || 'image/jpeg';
    const dataUri=`data:${mime};base64,${req.file.buffer.toString('base64')}`;
    const duration=Number(req.body.duration)===10?10:5;
    const resolution=req.body.resolution==='1080p'?'1080p':'720p';
    const allowed=['9:16','16:9','1:1','4:5','5:4','3:2','2:3'];
    const aspect_ratio=allowed.includes(req.body.aspect_ratio)?req.body.aspect_ratio:'9:16';

    const result=await fal.subscribe('fal-ai/pika/v2.2/pikascenes',{
      input:{
        image_urls:[dataUri],
        prompt:req.body.prompt,
        aspect_ratio,
        resolution,
        duration,
        ingredients_mode:'precise'
      }
    });
    res.json({videoUrl:result.data.video.url});
  }catch(err){
    console.error(err);
    res.status(500).json({error:err?.message||'Video generation failed.'});
  }
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`CineAI running on http://localhost:${port}`));
