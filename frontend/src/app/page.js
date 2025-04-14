import Image from "next/image";
import LINK from "next/link";
export default function Home() {
  return (
    <div >
          {/* <h1>Hello World</h1> */}
          <div>
            <button><LINK href= "./SignUp">SignUp</LINK></button>
          
          </div>
          <div>
           <button><LINK href= "./SignIn">SignIn</LINK></button>
          </div>
    </div>
  );
}
