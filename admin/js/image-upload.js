/* Normalizes common phone/browser image uploads before GitHub publishing. */
(function(){
 const originalUpload=GH.upload.bind(GH);
 const extFor=(file)=>{const t=(file.type||'').toLowerCase();if(t.includes('png'))return'png';if(t.includes('webp'))return'webp';if(t.includes('gif'))return'gif';if(t.includes('jpeg')||t.includes('jpg'))return'jpg';if(t.includes('heic'))return'heic';if(t.includes('heif'))return'heif';return(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg'};
 async function toJpeg(file){
  if(!file)throw Error('No image selected.');
  if(file.size>15*1024*1024)throw Error('Image is too large. Please choose an image below 15 MB.');
  const url=URL.createObjectURL(file);
  try{
   const image=new Image();image.decoding='async';image.src=url;await image.decode();
   const max=2400,scale=Math.min(1,max/Math.max(image.naturalWidth,image.naturalHeight)),w=Math.max(1,Math.round(image.naturalWidth*scale)),h=Math.max(1,Math.round(image.naturalHeight*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(image,0,0,w,h);
   const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.9));if(!blob)throw Error('Conversion failed');
   return new File([blob],(file.name.replace(/\.[^.]+$/,'')||'image')+'.jpg',{type:'image/jpeg',lastModified:Date.now()});
  }finally{URL.revokeObjectURL(url)}
 }
 GH.prepareImage=async function(file){
  if(!file)throw Error('No image selected.');
  const type=(file.type||'').toLowerCase(),ext=extFor(file);
  if(!type.startsWith('image/')&&!['heic','heif'].includes(ext))throw Error('Please choose an image file.');
  try{return{file:await toJpeg(file),ext:'jpg'}}catch(e){
   if(['jpg','jpeg','png','webp','gif'].includes(ext))return{file,ext:ext==='jpeg'?'jpg':ext};
   throw Error('This photo format could not be converted by the browser. On iPhone, choose the photo from the Photos picker or save/export it as JPEG first.');
  }
 };
 GH.uploadImage=async function(folder,id,file){const p=await GH.prepareImage(file),path=`images/${folder}/${id}.${p.ext}`;await originalUpload(path,p.file);return path};
})();