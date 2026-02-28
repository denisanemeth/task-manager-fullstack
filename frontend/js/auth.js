

// always communicate with the API using a relative path. this avoids
// any chance of the browser accidentally targeting localhost or the wrong
// port. the backend injects window.API_URL for other purposes (e.g. if the
// frontend is served separately), but our code ignores it to keep things
// simple.
const API_URL = '/api';

function showMessage(text,type){
    const messageDiv=document.getElementById('message');
    messageDiv.textContent=text;
    messageDiv.className=`message ${type}`;
}

function hideMessage(){
    const messageDiv=document.getElementById('message');
    messageDiv.className='message';
    messageDiv.textContent='';
}
//seteaza buton in stare loading
function setLoading(btnId,isLoading){
    const btn=document.getElementById(btnId);
    if(isLoading){
        btn.disabled=true;
        btn.innerHTML='<span class="loading"></span>Se proceseaza...';

    }else{
        btn.disabled=false;
        btn.innerHTML=btn.id==='loginBtn' ? 'Logeaza-te' : 'Creeaza cont';

    }
}
async function handleLogin(event) {
    event.preventDefault();//opreste refres ul paginii la submit form
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    if(!email||!password){
        showMessage('Completeaza toate campurile!','error');

    }
    try{
        setLoading('loginBtn',true);
        hideMessage();
        //trimitem cererea la backend
        const response=await fetch(`${API_URL}/auth/login`,{
          method: 'POST',
          headers: {
            'Content-type':'application/json'
          },body:JSON.stringify({email,password})
          //transforma obiectul JS in string JSON


        });
        const data=await response.json();
        if(data.success){
            localStorage.setItem('token',data.data.token);
            localStorage.setItem('user',JSON.stringify(data.data.user));
            //ramane in browser dupa refresh
            showMessage('Login reusit!Te redirectionam...','success');
           window.location.href = 'index.html';
        }
        else{
            showMessage(data.message||'Email sau parola incorecta','error');

        }
    }catch(error){
        console.error('Login error:',error);
        showMessage('Eroare de conexiune.Verifoca ca serverul ruleaza!','error');

    }finally{
        setLoading('loginBtn',false);
    }
    
}

//register
async function handleRegister(event) {
    event.preventDefault();

    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    if(!name||!email||!password){
        showMessage('Completeaza toate campurile!','error');
        return;
    }
    if(password.length<6){
        showMessage('Parola trebuie sa aiba minim 6 caractere!','error');
        return;
    }
    try{
        setLoading('registerBtn',true);
        hideMessage();
        const response=await fetch(`${API_URL}/auth/register`,{
            method:'POST',
            headers: {
                'Content-Type':'application/json'

            },body:JSON.stringify({name,email,password})
        });
        const data=await response.json();
        if(data.success){
            localStorage.setItem('token',data.data.token);
            localStorage.setItem('user',JSON.stringify(data.data.user));
            showMessage('Cont creat cu succes!Te redirectionam...','success');
            window.location.href = 'index.html';
        }else{
            showMessage(data.message||'Eroare la inregistrare','error');

        }

    }catch(error){
        console.error('Register error',error);
        showMessage('Eroare de conexiune.Verifica ca serverul ruleaza!','error');

    }finally{
        setLoading('registerBtn',false);
    }
   

    
}
 const loginForm=document.getElementById('loginForm');
    const registerForm=document.getElementById('registerForm');
    if(loginForm){
        loginForm.addEventListener('submit',handleLogin);
    }
    if(registerForm){
        registerForm.addEventListener('submit',handleRegister);

    }
    // logout handler
function handleLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href='login.html';
}

// make it available for onclick attributes or other scripts
window.handleLogout = handleLogout;

// redirect back to index if already authenticated and currently on a login/register page
const token = localStorage.getItem('token');
const path = window.location.pathname;
if(token && (path.endsWith('login.html') || path.endsWith('register.html'))){
    window.location.href = 'index.html';
}
