<script>
        //<----------------------Imports------------------------------->
        import Login from "./login.svelte";
        import { onDestroy } from "svelte";
        import Navbar from '$lib/navbar.svelte';
        import { token_name } from '$lib/stores/store.js';
        import Dropdown from 'sv-bootstrap-dropdown';
    
        //<----------------------User related information ------------->
        let token = "";
        let isusractive;
        let isUserAdmin;
        const unsubscribe = token_name.subscribe(value =>{token = value.token, isusractive = value.is_user_active, isUserAdmin = value.is_admin});
        console.log(isUserAdmin)
    
        onDestroy(unsubscribe)

         //<----------------------Site related information ------------->
        
        let respFromRequest = "";
        let errorMsg = "";
        let dropdownTrigger;
        let dropdownTriggerForApo;
        let valueFromDropDown = 'Lægemiddelform';
        let valueFromDropDownApo = 'Vælg Apotek';

        let medicin = "";
        let styrke = "";
        let pakning = "";
        let bestil = "";


        let listOfOrderedItems = [];  
        let listOfApoteker = [];

        listOfApoteker.push("Charlottenlund Apotek","Køge Apotek","Solrød Apotek")



        function addOrderToList(){
          respFromRequest = "";
          listOfOrderedItems.push({
            "medicin":medicin, 
            "styrke":styrke,
            "pakning":pakning,
            "bestil":bestil,
            "adm":valueFromDropDown,
            "status": "none"})

          listOfOrderedItems = listOfOrderedItems;
          medicin = "";
          styrke = "";
          pakning = "";
          bestil = "";
          console.log(listOfOrderedItems)
      }


        const remove = item => {
        listOfOrderedItems = listOfOrderedItems.filter(i => i !== item);}

      async function addOrderlistToDB(){
          console.log(listOfOrderedItems)
        console.log(token)
        await fetch('https://apoorder.herokuapp.com/createOrder', {
		    method: 'POST',
		    body: JSON.stringify({"token":token, "order":listOfOrderedItems, "apotek":valueFromDropDownApo}),
        headers: { 'Content-Type': 'application/json' },
 
        }).then(res => {
          if(!res.ok){
            respFromRequest = "Du har ikke tilføjet noget til din liste"
            throw new Error("Failed!")
          }
          respFromRequest = "Ordrer afsendt, Bestilling kan ses under Mine bestillinger."
          listOfOrderedItems = [];
      
          return res.status;
   
        })
        .then (data => {
          return"done"
        }) 
        .catch(err => {
          console.log(err);
        })
        }
 
    </script>

    {#if isusractive && !isUserAdmin}
    <Navbar></Navbar>
    <div class="container py-4">
        <header class="pb-3 mb-4 border-bottom">
          <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
            <span class="fs-4">Ny bestilling</span>
          </a>
        </header>
    
        <div class="p-5 mb-4 bg-light rounded-3">
          <div class="container-fluid py-5">
            <p class="display-5 fw-bold"></p>
            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="inputGroup-sizing-default">Medicin</span>
                    </div>
                    <input bind:value={medicin} type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                  </div>
                </div>
                <div class="col-sm">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="inputGroup-sizing-default">Styrke</span>
                    </div>
                    <input bind:value={styrke} type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                  </div>
                </div>
                <div class="col-sm">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="inputGroup-sizing-default">Stk/pakning</span>
                    </div>
                    <input bind:value={pakning} type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                  </div>
                </div>
                <div class="col-sm">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Bestil</span>
                  </div>
                  <input bind:value={bestil} type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                </div>
                </div>
                <div class="col-sm">
                  <div class="dropdownforapo">
                  <Dropdown triggerElement={dropdownTrigger}>
                    <button
                        type="button"
                        class="btn btn-secondary dropdown-toggle"
                        bind:this={dropdownTrigger}
                        >
                        {valueFromDropDown}
                    </button>
                    <div slot="DropdownMenu">
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Tabletter'}>Tabletter</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Smeltetabletter'}>Smeltetabletter</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Oral opløsning'}>Oral opløsning</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Injektionsvæske'}>Injektionsvæske</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Supositorier'}>Supositorier</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Creme'}>Creme</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Salve'}>Salve</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Gel'}>Gel</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Øjendråber'}>Øjendråber</button>
                         <button class="dropdown-item" type="button" on:click={() => valueFromDropDown = 'Øredråber'}>Øredråber</button>
                    </div>
          
                    </Dropdown>
                  </div>
                </div>
                
              </div>
            </div>
            <div class="dropdownforapo">
            <Dropdown triggerElement={dropdownTriggerForApo}>
              <button
                  type="button"
                  class="btn btn-secondary dropdown-toggle"
                  bind:this={dropdownTriggerForApo}
                  >
                  {valueFromDropDownApo}
              </button>
              <div slot="DropdownMenu">
                {#each listOfApoteker as apo}
                <button class="dropdown-item" type="button" on:click={() => valueFromDropDownApo = apo}>{apo}</button>
                {/each}
                 </div>
              </Dropdown>
            </div>
            {#if medicin != "" && styrke != "" && pakning !="" && bestil !="" && valueFromDropDown !="Lægemiddelform" && valueFromDropDownApo !="Vælg Apotek"}
            <button class="btn btn-primary btn-sl" type="button" on:click={addOrderToList}>Tilføj bestilling</button>
            {:else}
            <div class="alert alert-success" role="alert">
              Alle felter skal udfyldes før du kan tilføje et preparat
            </div>
            {/if}
          </div>
        </div>
      </div>

   
      
   
    <div class="container py-4">
      <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5"style="overflow:scroll; height:280px;">
          <p class="display-5 fw-bold"></p>
          <div class="container" >
            <div class="row">
              <table class="table">
                <thead>
                
                  <tr>
                    <th scope="col">Medicin</th>
                    <th scope="col">Styrke</th>
                    <th scope="col">Stk/pakning</th>
                    <th scope="col">Bestil</th>
                    <th scope="col">Lægemiddelform</th>
                  </tr>
                </thead>
                <tbody>
                  {#each listOfOrderedItems as item, i }
                  <tr>
                    <td>{item.medicin}</td>
                    <td>{item.styrke}</td>
                    <td>{item.pakning}</td>
                    <td>{item.bestil}</td>
                    <td>{item.adm}</td>
                    <td> <button class="btn btn-warning btn-sl" type="button" on:click={() => remove(item)}>Slet</button></td>
                  </tr>
                  {/each}

                </tbody>
              </table>
              <div class="col-sm">
                <div class="input-group mb-3">
                </div>
              </div>
            </div>
          </div>  
        </div>
        
        <button class="btn btn-info btn-sl" type="button" on:click={addOrderlistToDB}>Send bestilling</button>
        {#if respFromRequest == ""}
        <p></p>
        {:else if respFromRequest == "Ordrer afsendt, Bestilling kan ses under Mine bestillinger."}
        <div  class="alert alert-success" role="alert">
          {respFromRequest}
        </div>
        {:else}
        <div  class="alert alert-danger" role="alert">
          {respFromRequest}
        </div>
        {/if}
       

      </div>

    </div>
    {:else if isUserAdmin}
    <Navbar></Navbar>
    <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
      <div class="col-md-5 p-lg-5 mx-auto my-5">
        <h1 class="display-4 font-weight-normal">Ingen adgang</h1>
        <p class="lead font-weight-normal">Du kan desværre ikke tilgå denne side da du er logget ind som apotek</p>
        <a class="btn btn-outline-secondary" href="/">Tilbage til forside</a>
      </div>
      <div class="product-device box-shadow d-none d-md-block"></div>
      <div class="product-device product-device-2 box-shadow d-none d-md-block"></div>
    </div>
    {:else}
    <Login></Login>
    {/if}


<style>

.dropdownforapo{
  margin-left: 12px;
}
.alert-danger{
  margin-top: 10px;
  padding-left: 10px;
  margin-left: 20px;
  max-width: 50%;

}

.alert-success{

  margin-top: 10px;
  padding-left: 10px;
  margin-left: 20px;
  max-width: 50%;

}

.btn-warning{
  background-color: rgb(173, 31, 31);
  border-color: rgb(146, 25, 25);
  color: #ffffff;
}
.btn-info{
  margin-left: 20px;
  background-color: #218a49;
  border-color: #90beae;
  color: white;
}

.btn-primary{
  margin-top: 20px;
  margin-left: 10px;
  background-color: #90beae;
  border-color: #90beae;
}
.display-5 {
    font-size: 34px;
    padding-left: 10px;
}
.fw-bold {
  
    font-weight: 300!important;
}

.input-group-text{
  background-color: #90beae;
  border-color: #90beae;
  color: #ffffff;
}
.btn-secondary {
  background-color: #90beae;
  border-color: #90beae;
}
    @import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");

.bg-light {
    background-color: #EAF2EF!important;
}
.center {
position: fixed;
top: 20%;
left: 50%;
transform: translate(-50%, -50%);
}

h5{
  padding-left: 11px;
  color: rgb(187, 86, 86);
}
</style>
    