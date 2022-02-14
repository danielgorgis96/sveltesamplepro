
<script>
    //<----------------------Imports------------------------------->
    import Navbar from '$lib/navbar.svelte';
    import {token_name} from '$lib/stores/store.js';
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

  
    //<----------------------User related information ------------->
    let token = "";
    let isusractive = "";
    let isUserAdmin = "";
    let isSaved = false;
    const unsubscribe = token_name.subscribe(value =>{token = value.token, isusractive = value.is_user_active, isUserAdmin = value.is_admin});

    onDestroy(unsubscribe)

    //<----------------------Site related information ------------->
     let listOfOrders = [];
     let inputVal;
     let changedItem ={};
     let yes = false;
  
    let sortedList = listOfOrders.filter(item => item.isHandled === false)
     
    console.log("the list" ,sortedList)

     async function fetchAllOrders(){
      console.log("token name is" ,token);
      await fetch('https://apoorder.herokuapp.com/getAllOrders', {
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

     async function updateOrder(orderList,Id){
      console.log(orderList)
      await fetch('https://apoorder.herokuapp.com/updateOrder', {
		    method: 'POST',
		    body: JSON.stringify({"token":token,"order":orderList,"orderID":Id}),
        headers: { 'Content-Type': 'application/json' },
 
        }).then(res => {
          if(!res.ok){
            throw new Error("Failed!")
          }
          

          return res.json();
   
        })
        .then (data => {
          return"done"
        }) 
        .catch(err => {
          console.log(err);
        })

     }
     


     function setIsSaved(){
       isSaved = false;
     }
 
     fetchAllOrders()
</script>




<Navbar></Navbar>
<header class="pb-3 mb-4 border-bottom">
  <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
    <span class="fs-4">Alle ordre </span>
  </a>
</header>
<div class="row"style="overflow:scroll;" >
  <div class="form-check form-switch">
    <input class="form-check-input"  type="checkbox"  bind:checked={yes} id="flexSwitchCheckChecked">
    <label class="form-check-label" for="flexSwitchCheckChecked">Skjul afsluttede bestillinger</label>
  </div>
  {#each listOfOrders as item, i}
  {#if yes && !item.isHandled}
  <div class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        {#if item.isHandled}
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#p{i}" aria-expanded="false">
          Bestilling Modtaget {item.date} Bestilling allerede behandlet .<i class="fas fa-check"></i>
         </button>
         {:else}
         <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#p{i}" aria-expanded="false">
          Bestilling Modtaget {item.date} Bestilling endnu ikke behandlet 
         </button>
        {/if}
      </h2>
      <div id="p{i}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <ul>
           <p>Ordrerliste:</p>
          {#each item.order as order,i} 
          <div class="alert alert-success" role="alert">
            {order.medicin}
   
              <label for="basic-url">Hvis intet skrives i kommentarfeltet nedenunder markeres varen som "på lager"</label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon3">Hvis varen er i restordre så indtast ugenr. for levering her.</span>
              </div>
              <input type="number" min="0" max="52" class="form-control" bind:value={order.status} placeholder=" f.eks. 24" id="basic-url" aria-describedby="basic-addon3">
            </div>
          </div>
          <div>

          </div>
          {/each} 
          <button type="button" class="btn btn-success" on:click={() => {updateOrder(item ,item.orderID), isSaved = true}}>Gem ændringer</button>
          {#if isSaved}
          <div in:fade={{ delay: 2 }} out:fade={{ delay: 200 }} class="alert alert-success" role="alert">
          <i class="fas fa-times-circle" on:click={setIsSaved}></i>
            Ændringer gemt!
            
          </div>
          {/if}

        </ul>
        </div>
      </div>
    </div>
  </div>
  {:else if !yes }
  <div class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        {#if item.isHandled}
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#p{i}" aria-expanded="false">
          Bestilling Modtaget {item.date} Bestilling allerede behandlet .<i class="fas fa-check"></i>
         </button>
         {:else}
         <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#p{i}" aria-expanded="false">
          Bestilling Modtaget {item.date} Bestilling endnu ikke behandlet 
         </button>
        {/if}
      </h2>
      <div id="p{i}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <ul>
           <p>Ordrerliste:</p>
          {#each item.order as order,i} 
          <div class="alert alert-success" role="alert">
            {order.medicin}
   
              <label for="basic-url">Hvis intet skrives i kommentarfeltet nedenunder markeres varen som "på lager"</label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon3">Hvis varen er i restordre så indtast ugenr. for levering her.</span>
              </div>
              <input type="number" min="0" max="52" class="form-control" bind:value={order.status} placeholder=" f.eks. 24" id="basic-url" aria-describedby="basic-addon3">
            </div>
          </div>
          <div>

          </div>
          {/each} 
          <button type="button" class="btn btn-success" on:click={() => {updateOrder(item ,item.orderID), isSaved = true}}>Gem ændringer</button>
          {#if isSaved}
          <div in:fade={{ delay: 2 }} out:fade={{ delay: 200 }} class="alert alert-success" role="alert">
          <i class="fas fa-times-circle" on:click={setIsSaved}></i>
            Ændringer gemt!   
          </div>
          {/if}

        </ul>
        </div>
      </div>
    </div>
  </div>
  {/if}
  {/each}
  <div class="center">
</div>
</div>

<style>

.alert-success{
  margin-top: 15px;
}

.accordion-button.collapsed {
    color: white;

}
.fa-check{
  color: green;
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

.form-check{
  margin-top: 2px;
  margin-left: 10px;
}

.form-check-input{
  background-color: #90beae;
  border-color: #90beae;
}


</style>

