import React,{ useState } from 'react';
import { Button } from "@progress/kendo-react-buttons";
import { httppost, httpget } from "./../commonUtility/common_http";
import { fetch_users_url, tenant_id} from "./../commonUtility/api_urls";


const Signin = () =>  {

    const [email,   setEmail] = useState("");
    const [allEntry,setAllEntry]= useState([]);

    const submitForm =(e) =>{  
        e.preventDefault();

        const newEntry = { email:email};
        setAllEntry([...allEntry,newEntry]);
        console.log();
    }

    const isvaliduser = ()=>{
        alert("Hi");
    }

    React.useEffect(() => {
        const req_value = {
          params: { tenant_id: tenant_id },
        };
        

    console.log(fetch_users_url);
  httpget(fetch_users_url, req_value).then((result) => {
  console.log(result);
  });
},
[]);

return (
    <>
    
    <form action="" onSubmit={submitForm}>
    <div>
        
        <label htmlFor="email">Email</label>&nbsp;
        <br/>
        <input type="text" name="email" id="email" autoComplete="off"
        value={email}
        onChange={(e) =>setEmail(e.target.value)}
        />
    </div>
    <br/>
     <Button type="button" onClick={isvaliduser()}>Sign In</Button>
   </form>
        
          <div>
            {
             allEntry.map((curElem) => {
            return (
            <div classname="showDataStyle">
            <p>{curElem.email}</p>
            </div>
            )

            })
                }
            </div>
</>



 
    )
}

export default Signin;