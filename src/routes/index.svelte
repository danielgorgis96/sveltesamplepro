<script>
import Login from "./login.svelte";


    import { onDestroy } from "svelte";
    import Navbar from '$lib/navbar.svelte';
    import { token_name } from '$lib/stores/store.js';

 
    let token = "";
    let isusractive;
    const unsubscribe = token_name.subscribe(value =>{token = value.token, isusractive = value.is_user_active});

    onDestroy(unsubscribe)
    console.log(isusractive)
</script>

{#if isusractive }
<Navbar></Navbar>
<div class="center">
	<h1>Hello world!</h1>
    <h1>{token}</h1>
    <h1>{isusractive}</h1>

</div>
<div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
  <div class="col-md-5 p-lg-5 mx-auto my-5">
    <h1 class="display-4 font-weight-normal">Apo-order</h1>
    <p class="lead font-weight-normal">Velkommen til Apo-order. Vælg side ude i menuen til venstre eller klik på en af knapperne nedenfor</p>
    <a class="btn btn-outline-secondary" href="/orders">Mine bestillinger</a>
    <a class="btn btn-outline-secondary" href="/createOrder">Ny bestilling</a>
  </div>
  <p class="leads">beta version 1.0.0</p>
  <div class="product-device box-shadow d-none d-md-block"></div>
  <div class="product-device product-device-2 box-shadow d-none d-md-block"></div>
</div>

{:else}
  <Login></Login>
{/if}

<style>
.leads{
  font-size: 13px;
}
.btn{
  border-color: #90beae;
  color: #90beae;
}  
.position-relative{
  background-color: #90beae;
}
.center {
position: fixed;
top: 20%;
left: 50%;
transform: translate(-50%, -50%);
}
</style>
