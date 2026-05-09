// Simple client-side app for the static JELLWOW site
(function(){
  const jobs = [
    {id:1,title:'Software Engineer',company:'google.com',companyName:'Google',country:'US',city:'Mountain View',state:'CA',salary:160000,remote:'hybrid',visa:true,verified:true,industry:'tech'},
    {id:2,title:'Senior Frontend Engineer',company:'apple.com',companyName:'Apple',country:'US',city:'Cupertino',state:'CA',salary:170000,remote:'onsite',visa:false,verified:true,industry:'tech'},
    {id:3,title:'Logistics Manager',company:'amazon.com',companyName:'Amazon',country:'US',city:'Seattle',state:'WA',salary:90000,remote:'onsite',visa:true,verified:true,industry:'logistics'},
    {id:4,title:'Barista',company:'starbucks.com',companyName:'Starbucks',country:'US',city:'Seattle',state:'WA',salary:34000,remote:'onsite',visa:false,verified:true,industry:'retail'},
    {id:5,title:'Machine Learning Engineer',company:'microsoft.com',companyName:'Microsoft',country:'US',city:'Redmond',state:'WA',salary:165000,remote:'hybrid',visa:true,verified:true,industry:'tech'},
    {id:6,title:'Warehouse Associate',company:'walmart.com',companyName:'Walmart',country:'US',city:'Bentonville',state:'AR',salary:32000,remote:'onsite',visa:false,verified:true,industry:'retail'},
    {id:7,title:'Driver',company:'fedex.com',companyName:'FedEx',country:'US',city:'Memphis',state:'TN',salary:45000,remote:'onsite',visa:false,verified:true,industry:'logistics'},
    {id:8,title:'Data Analyst',company:'netflix.com',companyName:'Netflix',country:'US',city:'Los Gatos',state:'CA',salary:140000,remote:'remote',visa:false,verified:true,industry:'tech'},
    {id:9,title:'UX Designer',company:'meta.com',companyName:'Meta',country:'US',city:'Menlo Park',state:'CA',salary:150000,remote:'hybrid',visa:true,verified:true,industry:'tech'},
    {id:10,title:'Cashier',company:'costco.com',companyName:'Costco',country:'US',city:'Issaquah',state:'WA',salary:30000,remote:'onsite',visa:false,verified:true,industry:'retail'},
    {id:11,title:'Software Dev',company:'tesla.com',companyName:'Tesla',country:'US',city:'Austin',state:'TX',salary:150000,remote:'onsite',visa:true,verified:true,industry:'tech'}
  ];

  const companies = [
    {domain:'google.com',name:'Google',country:'US',industry:'tech',verified:true},
    {domain:'amazon.com',name:'Amazon',country:'US',industry:'logistics',verified:true},
    {domain:'apple.com',name:'Apple',country:'US',industry:'tech',verified:true},
    {domain:'microsoft.com',name:'Microsoft',country:'US',industry:'tech',verified:true},
    {domain:'meta.com',name:'Meta',country:'US',industry:'tech',verified:true},
    {domain:'netflix.com',name:'Netflix',country:'US',industry:'tech',verified:true},
    {domain:'walmart.com',name:'Walmart',country:'US',industry:'retail',verified:true},
    {domain:'tesla.com',name:'Tesla',country:'US',industry:'tech',verified:true},
    {domain:'fedex.com',name:'FedEx',country:'US',industry:'logistics',verified:true},
    {domain:'costco.com',name:'Costco',country:'US',industry:'retail',verified:true},
    {domain:'starbucks.com',name:'Starbucks',country:'US',industry:'retail',verified:true}
  ];

  // Utility: Clearbit logo URL
  function logoFor(domain){
    return 'https://logo.clearbit.com/'+domain;
  }

  // Populate home page elements
  function populateHome(){
    const statJobs = document.getElementById('statJobs');
    const statCompanies = document.getElementById('statCompanies');
    const statCountries = document.getElementById('statCountries');
    if(statJobs) statJobs.textContent = jobs.length + '+';
    if(statCompanies) statCompanies.textContent = companies.length + '+';
    if(statCountries) statCountries.textContent = '195+';

    const featuredJobs = document.getElementById('featuredJobs');
    if(featuredJobs){
      jobs.slice(0,6).forEach(j=>{
        const el = document.createElement('div'); el.className='job-card';
        el.innerHTML = `<img src="${logoFor(j.company)}" alt="${j.companyName}" style="height:36px"><h4>${j.title}</h4><p>${j.companyName} — ${j.city}, ${j.state}</p><p>$${j.salary.toLocaleString()}</p>`;
        featuredJobs.appendChild(el);
      })
    }

    const featuredCompanies = document.getElementById('featuredCompanies');
    if(featuredCompanies){
      companies.slice(0,8).forEach(c=>{
        const card = document.createElement('div'); card.className='company-card';
        card.innerHTML = `<img src="${logoFor(c.domain)}" alt="${c.name}"><div><h4>${c.name}${c.verified? ' ✅':''}</h4><p>${c.industry}</p><a href="/company.html?domain=${encodeURIComponent(c.domain)}">View profile</a></div>`;
        featuredCompanies.appendChild(card);
      })
    }

    // Country selector
    const countrySelect = document.getElementById('countrySelect');
    const fCountry = document.getElementById('filterCountry');
    const companyCountry = document.getElementById('companyCountry');
    if(countrySelect){
      [{code:'US',name:'United States'},{code:'GB',name:'United Kingdom'},{code:'CA',name:'Canada'}].forEach(c=>{
        const opt=document.createElement('option'); opt.value=c.code; opt.textContent=c.name; countrySelect.appendChild(opt);
      })
    }
    if(fCountry){
      ['Any','US','GB','CA'].forEach(c=>{const o=document.createElement('option');o.value=c; o.textContent=c; fCountry.appendChild(o)})
    }
    if(companyCountry){
      ['Any','US','GB','CA'].forEach(c=>{const o=document.createElement('option');o.value=c; o.textContent=c; companyCountry.appendChild(o)})
    }

    // footer flags
    const footerCountries = document.getElementById('footerCountries');
    if(footerCountries){
      [['us','United States'],['gb','United Kingdom'],['ca','Canada']].forEach(c=>{
        const img = document.createElement('img'); img.src = `https://flagcdn.com/24x18/${c[0]}.png`; img.alt=c[1]; img.title=c[1]; img.style.height='16px'; img.style.marginRight='6px'; footerCountries.appendChild(img);
      })
    }

    const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
  }

  // Render jobs list with pagination and filters
  function renderJobs(listElId, data, perPage=6, paginationId){
    const container = document.getElementById(listElId);
    if(!container) return;
    let currentPage = 1;
    function draw(){
      container.innerHTML='';
      const start=(currentPage-1)*perPage; const pageItems=data.slice(start,start+perPage);
      pageItems.forEach(j=>{
        const el = document.createElement('div'); el.className='job-card';
        el.innerHTML = `<img src="${logoFor(j.company)}" style="height:36px"><h3>${j.title}</h3><p>${j.companyName} — ${j.city}, ${j.state} (${j.country})</p><p>Salary: $${j.salary.toLocaleString()} — ${j.remote} — Visa: ${j.visa? 'Yes':'No'}</p><a href="/company.html?domain=${encodeURIComponent(j.company)}">View company</a>`;
        container.appendChild(el);
      })
      const totalPages = Math.ceil(data.length/perPage);
      const pag = document.getElementById(paginationId);
      if(pag){
        pag.innerHTML='';
        for(let i=1;i<=totalPages;i++){
          const btn=document.createElement('button'); btn.textContent=i; btn.disabled = (i===currentPage);
          btn.addEventListener('click',()=>{currentPage=i; draw()})
          pag.appendChild(btn)
        }
      }
    }
    draw();
  }

  // Company profile
  function populateCompanyProfile(){
    const params = new URLSearchParams(location.search);
    const domain = params.get('domain'); if(!domain) return;
    const comp = companies.find(c=>c.domain===domain); if(!comp) return;
    const profile = document.getElementById('companyProfile');
    if(profile){
      profile.innerHTML = `<div class="company-card"><img src="${logoFor(comp.domain)}"><div><h2>${comp.name} ${comp.verified?'<span>✅ Verified</span>':''}</h2><p>Industry: ${comp.industry}</p><p>Country: ${comp.country}</p></div></div>`;
    }
    const compJobs = document.getElementById('companyJobs');
    if(compJobs){
      const list = jobs.filter(j=>j.company===domain);
      list.forEach(j=>{const el=document.createElement('div'); el.className='job-card'; el.innerHTML=`<h4>${j.title}</h4><p>${j.city}, ${j.state}</p><p>$${j.salary.toLocaleString()}</p>`; compJobs.appendChild(el)})
    }
  }

  // Companies directory
  function populateCompaniesList(){
    const el = document.getElementById('companiesList'); if(!el) return;
    companies.forEach(c=>{const card=document.createElement('div');card.className='company-card';card.innerHTML=`<img src="${logoFor(c.domain)}"><div><h4>${c.name}${c.verified? ' ✅':''}</h4><p>${c.industry}</p><a href="/company.html?domain=${encodeURIComponent(c.domain)}">Profile</a></div>`;el.appendChild(card)})
  }

  // Simple resume builder
  function resumeBuilder(){
    const expList = document.getElementById('experienceList');
    const eduList = document.getElementById('educationList');
    const addExp = document.getElementById('addExperience');
    const addEdu = document.getElementById('addEducation');
    const preview = document.getElementById('previewResume');
    const rName = document.getElementById('rName');
    const rTitle = document.getElementById('rTitle');
    const rSummary = document.getElementById('rSummary');
    const newSkill = document.getElementById('newSkill');
    let skills=[];
    function addExperienceField(data){
      const d = data||{}; const div=document.createElement('div'); div.innerHTML=`<input placeholder="Role" class="exp-role" value="${d.role||''}"><input placeholder="Company" class="exp-company" value="${d.company||''}"><input placeholder="Years" class="exp-years" value="${d.years||''}"><textarea placeholder="Details" class="exp-details">${d.details||''}</textarea><button class="exp-remove">Remove</button>`;
      expList.appendChild(div);
      div.querySelector('.exp-remove').addEventListener('click',()=>div.remove());
    }
    function addEducationField(data){
      const d=data||{}; const div=document.createElement('div'); div.innerHTML=`<input placeholder="Institution" class="edu-school" value="${d.school||''}"><input placeholder="Qualification" class="edu-qual" value="${d.qual||''}"><input placeholder="Years" class="edu-years" value="${d.years||''}"><button class="edu-remove">Remove</button>`; eduList.appendChild(div); div.querySelector('.edu-remove').addEventListener('click',()=>div.remove());
    }
    if(addExp) addExp.addEventListener('click',()=>addExperienceField());
    if(addEdu) addEdu.addEventListener('click',()=>addEducationField());
    if(newSkill) newSkill.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); if(newSkill.value.trim()){skills.push(newSkill.value.trim()); newSkill.value=''; renderPreview();}}});

    function gather(){
      const exps = Array.from(document.querySelectorAll('#experienceList > div')).map(d=>({role:d.querySelector('.exp-role').value, company:d.querySelector('.exp-company').value, years:d.querySelector('.exp-years').value, details:d.querySelector('.exp-details').value}));
      const edus = Array.from(document.querySelectorAll('#educationList > div')).map(d=>({school:d.querySelector('.edu-school').value,qual:d.querySelector('.edu-qual').value,years:d.querySelector('.edu-years').value}));
      return {name:rName.value,title:rTitle.value,summary:rSummary.value,experience:exps,education:edus,skills:skills};
    }
    function renderPreview(){
      if(!preview) return; const data=gather(); preview.innerHTML=`<h2>${data.name}</h2><h3>${data.title}</h3><p>${data.summary}</p><h4>Experience</h4>${data.experience.map(e=>`<div><b>${e.role}</b> — ${e.company} (${e.years})<div>${e.details}</div></div>`).join('')}<h4>Education</h4>${data.education.map(e=>`<div>${e.school} — ${e.qual} (${e.years})</div>`).join('')}<h4>Skills</h4><p>${data.skills.join(', ')}</p>`;
    }
    const previewBtn = document.getElementById('previewResume'); if(previewBtn) previewBtn.addEventListener('click',renderPreview);

    // Downloads
    document.getElementById('downloadTxt').addEventListener('click',()=>{
      const d=gather(); let txt=`${d.name}\n${d.title}\n\n${d.summary}\n\nExperience:\n`+d.experience.map(e=>`${e.role} at ${e.company} (${e.years})\n${e.details}\n`).join('\n')+`\nEducation:\n`+d.education.map(e=>`${e.school} — ${e.qual} (${e.years})`).join('\n')+`\n\nSkills:\n${d.skills.join(', ')}`;
      const blob=new Blob([txt],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=(d.name||'resume')+'.txt'; a.click(); URL.revokeObjectURL(url);
    });

    document.getElementById('downloadPdf').addEventListener('click',async ()=>{
      const { jsPDF } = window.jspdf; const doc = new jsPDF(); const d=gather(); let y=10; doc.setFontSize(14); doc.text(d.name,10,y); y+=8; doc.setFontSize(12); doc.text(d.title,10,y); y+=8; doc.setFontSize(10); doc.text(d.summary,10,y); y+=10; doc.setFontSize(12); doc.text('Experience',10,y); y+=6; d.experience.forEach(e=>{doc.setFontSize(11); doc.text(`${e.role} at ${e.company} (${e.years})`,10,y); y+=6; doc.setFontSize(10); doc.text(e.details,10,y); y+=8}); doc.save((d.name||'resume')+'.pdf');
    });

    document.getElementById('downloadDocx').addEventListener('click',()=>{
      const d=gather(); let content = `${d.name}\n${d.title}\n\n${d.summary}\n\nExperience:\n`+d.experience.map(e=>`${e.role} at ${e.company} (${e.years})\n${e.details}\n`).join('\n')+`\nEducation:\n`+d.education.map(e=>`${e.school} — ${e.qual} (${e.years})`).join('\n')+`\n\nSkills:\n${d.skills.join(', ')}`;
      const blob = new Blob([content],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(d.name||'resume')+'.docx'; a.click();
    });

  }

  // Support form handling (local only)
  function supportForm(){
    const form = document.getElementById('supportForm'); if(!form) return;
    form.addEventListener('submit',e=>{e.preventDefault(); document.getElementById('supportResult').textContent='Message submitted (local demo). Thank you.'; form.reset();})
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded',()=>{
    populateHome();
    populateCompaniesList();
    populateCompanyProfile();
    supportForm();
    // Render all jobs page
    renderJobs('jobsList', jobs, 6, 'pagination');
    // Render USA jobs page: filter country US
    const usa = jobs.filter(j=>j.country==='US'); renderJobs('usaJobsList', usa, 6, 'usaPagination');
    // Resume builder
    if(document.getElementById('resumeBuilder') || document.querySelector('.resume-builder')) resumeBuilder();
  });

  // Theme toggle: persist and apply
  document.addEventListener('DOMContentLoaded', ()=>{
    const toggle = document.getElementById('themeToggle');
    function applyTheme(t){
      if(t==='dark') document.body.classList.add('dark'); else document.body.classList.remove('dark');
      if(toggle) toggle.textContent = (t==='dark')? '☀️' : '🌙';
    }
    const stored = localStorage.getItem('jellwow_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(stored);
    if(toggle) toggle.addEventListener('click', ()=>{
      const now = document.body.classList.contains('dark')? 'light':'dark';
      localStorage.setItem('jellwow_theme', now);
      applyTheme(now);
    });
  });

})();
