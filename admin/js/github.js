
const GH={
 token:()=>sessionStorage.getItem('gh_token')||localStorage.getItem('gh_token')||'',
 config:()=>JSON.parse(localStorage.getItem('gh_config')||'{}'),
 headers(){return {'Accept':'application/vnd.github+json','Authorization':`Bearer ${this.token()}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'}},
 async file(path){let c=this.config();let r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${path}?ref=${encodeURIComponent(c.branch||'main')}`,{headers:this.headers()});if(!r.ok)throw Error(await r.text());return r.json()},
 async put(path,content,message){let c=this.config(),old=null;try{old=await this.file(path)}catch(e){};let bytes=new TextEncoder().encode(content),bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));let body={message,content:btoa(bin),branch:c.branch||'main'};if(old?.sha)body.sha=old.sha;let r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${path}`,{method:'PUT',headers:this.headers(),body:JSON.stringify(body)});if(!r.ok)throw Error(await r.text());return r.json()},
 async upload(path,file){let buf=new Uint8Array(await file.arrayBuffer()),bin='';buf.forEach(b=>bin+=String.fromCharCode(b));let c=this.config(),old=null;try{old=await this.file(path)}catch(e){};let body={message:`Upload ${path}`,content:btoa(bin),branch:c.branch||'main'};if(old?.sha)body.sha=old.sha;let r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${path}`,{method:'PUT',headers:this.headers(),body:JSON.stringify(body)});if(!r.ok)throw Error(await r.text());return path}
};
