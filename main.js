window.onload=()=>{

    //Create The Required Variables And Constants

    const BaseURL = "https://jsonplaceholder.typicode.com/todos/"

    const List = document.querySelector("#list")
    
    const Id_Selection = document.querySelector("#Id_Selection")

    const New_Item = document.querySelector("#New_Item")

    const Add = document.querySelector("#Add")
    
    let Data=[]

    let usersIds = []

    let current=1

    //Create  The Get Data Function  

    const  GetData = () => {

        // Check Data In LocalStorage And If It Is There Use It

        if(localStorage.getItem('ToDoListData')!=undefined){
            
            Data = localStorage.getItem('ToDoListData')
            Data = JSON.parse(Data)
            
        }

        // Else Get Data From The Server And Push Them To LocalStorage

        else{

            let myPrpmise = new Promise( (resolve,reject) => {
                
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(this.responseText)
                }
            }
            xhttp.open("GET", BaseURL, true);
            xhttp.send();

            
            }).then( (response) => {

                Data= JSON.parse(response)
                localStorage.setItem('ToDoListData',JSON.stringify(Data))
                window.location.reload()
            })

        }

    }

    // Create The Visual

    const CreateVisual =(current=1)=>{
        
        Id_Selection.innerHTML=""
        List.innerHTML=""

        for (item in Data) {
            if(usersIds.indexOf(Data[item].userId)==-1)
                usersIds.push(Data[item].userId)
        }

        for(id of usersIds){

            let option = document.createElement('option')
            option.value=id
            option.text=id
            if(id==current) {option.setAttribute('selected','selected')}
            Id_Selection.appendChild(option)

        }

        let counter=1

        for(item of Data){
            console.log(current)
            if(item.userId==current){
                let Item = document.createElement('div')
                Item.classList="item"
                let id_num=document.createElement('i')
                id_num.classList="item_number"
                id_num.innerText=counter
                Item.appendChild(id_num)
                let delete_button = document.createElement('button')
                delete_button.value= item.title
                delete_button.innerText = 'X'
                delete_button.classList = 'delete delete_button'
                delete_button.addEventListener('click', () => {
                    let new_Data = []
                        for(item_loop of Data){
                            if(item_loop.title==delete_button.value && item_loop.userId==Id_Selection.value){  
                                new_Data = Data.filter(function(value, index, arr){ 
                                    return value!=item_loop;                            
                                })
                            }
                        }
                        
                    localStorage.setItem('ToDoListData', JSON.stringify(new_Data));
                    GetData()
                    CreateVisual(Id_Selection.value)


                })
                let id_title=document.createElement('h1')
                id_title.innerText=item.title
                id_title.classList="title"
                Item.appendChild(id_title)
                Item.appendChild(delete_button)
                List.appendChild(Item)
                counter++
            }
        }
    }

    GetData()
    CreateVisual()

   Id_Selection.addEventListener('change',(e)=>{
        
        CreateVisual(e.target.value)
   
    })

    document.getElementById('Add').addEventListener('click',()=>{
        
        if(document.getElementById('New_Item').value==""){alert('You Have To Add New Item First'); return}

        else{
            let item_id = document.getElementsByClassName('item_number')
            new_id=parseInt(item_id[item_id.length-1].innerText)+1
            title= document.getElementById('New_Item').value
            userid=parseInt(Id_Selection.value)
            completed = false
            obj = {"userId":userid, "id":new_id, 'title':title, 'completed':completed}
            Data = [...Data,obj]
            localStorage.setItem('ToDoListData', JSON.stringify(Data));
            CreateVisual(Id_Selection.value)
        }

    })

}


