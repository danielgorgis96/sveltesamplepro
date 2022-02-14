<script>
    import Navbar from '$lib/navbar.svelte';
    import { token_name } from '$lib/stores/store.js';
    let userData = "none";
    let email = "";
    let password = "";


    async function login(){
        await fetch('https://apoorder.herokuapp.com/login', {
		method: 'POST',
		body: JSON.stringify({"email":email, "password":password}),
        headers: { 'Content-Type': 'application/json' },
 
	}).then(res => {
    if(!res.ok){
      throw new Error("Failed!")
    }
    return res.json();
  })
  .then (data => {
    console.log("is admin?",data);
    token_name.set({
        token:data.token,
        is_user_active: true,
      is_admin:data.isAdmin})

    return{
        status:301,
        redirect:'/orders'
    }
  }) 
  .catch(err => {
    console.log(err);
  })
    }

</script>


<Navbar></Navbar>
<div class="login">
    <h1>Apo-order</h1>
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Email</label>
      <input bind:value={email} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Adgangskode</label>
      <input bind:value={password} type="password" class="form-control" id="exampleInputPassword1">
    </div>
    <button type="submit" class="btn btn-primary" on:click={login} >Log ind</button>
</div>

  
  <style>
  


.login { 
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -150px 0 0 -150px;
    width:400px;
    height:400px;
}
.login { color: #5b6d66; text-shadow: 0 0 1px rgba(255, 255, 255, 0.3); letter-spacing:2px; text-align:center; }

h1{
    padding-bottom: 25px;
}
.btn{
    background-color: #5b6d66;
    border-color:  #5b6d66;;
}

    </style>