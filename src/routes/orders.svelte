
<script>
    //<----------------------Imports------------------------------->
    import Navbar from '$lib/navbar.svelte';
    import {token_name} from '$lib/stores/store.js';
    import { onDestroy, onMount } from 'svelte';
    import Login from './login.svelte';
    import AdminOrders from '$lib/adminOrders.svelte';
  
    //<----------------------User related information ------------->
    let token = "";
    let isusractive = "";
    let isUserAdmin = "";
    const unsubscribe = token_name.subscribe(value =>{token = value.token, isusractive = value.is_user_active, isUserAdmin = value.is_admin});

    onDestroy(unsubscribe)

    //<----------------------Site related information ------------->
     let listOfOrders = []

     async function fetchAllOrders(){
      console.log("token name is" ,token);
      await fetch('https://apoorder.herokuapp.com/getOrders', {
		    method: 'POST',
		    body: JSON.stringify({"token":token}),
        headers: { 'Content-Type': 'application/json' },
 
        }).then(res => {
          if(!res.ok){
            throw new Error("Failed!")
          }
          

          return res.json();
   
        })
        .then (data => {
          listOfOrders = data;
          listOfOrders.shift();
          console.log(listOfOrders)
          return"done"
        }) 
        .catch(err => {
          console.log(err);
        })
     }

     
     fetchAllOrders()

 

</script>

{#if isusractive && !isUserAdmin}

<Navbar></Navbar>
<header class="pb-3 mb-4 border-bottom">
  <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
    <span class="fs-4">Mine bestillinger</span>
  </a>
</header>
<div class="row"style="overflow:scroll;" >

  {#each listOfOrders as item, i}
  <div class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#p{i}" aria-expanded="false">
         Bestilling foretaget {item.date}
        </button>
      </h2>
      <div id="p{i}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <ul>
           <p>Ordrerliste:</p>
          {#each item.order as order}
          {#if order.status === "none"}
          <div class="alert alert-info" role="alert">
            {order.medicin} , Status: <strong>bestilling modtaget men ikke behandlet endnu</strong>
          </div>
          {:else if order.status == "På Lager"}
          <div class="alert alert-success" role="alert">
            {order.medicin} , Status: <strong>På Lager</strong>

          </div>
          {:else}
          <div class="alert alert-warning" role="alert">
            {order.medicin} , Status: <strong>{order.status}</strong>
          </div>

          {/if}
          {/each}

        </ul>
        </div>
      </div>
    </div>
  </div>
  {/each}
  <div class="center">
</div>
</div>
{:else if isUserAdmin}
<AdminOrders></AdminOrders>
{:else}
<Login></Login>
{/if}

<style>
.accordion-button.collapsed {
    color: white;

}
.accordion-button {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    font-weight: 440;
    color: #f0f0f0;
    text-align: left;
    background-color: #90beae;
    border: 0;
    border-radius: 0;
    overflow-anchor: none;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,border-radius .15s ease;
}

.row{
    margin-top: 10%;
    margin-left: 25%;
    margin-right: 25%;
    max-height:620px; 
    max-width:1200px;
}


.center {
position: fixed;
top: 20%;
left: 50%;
transform: translate(-50%, -50%);
}

.pb-3{
  margin-top: 80px;
  margin-left:170px;
}
</style>

