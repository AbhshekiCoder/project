
import LINK from "next/link";
export default function Home() {
  return (
    <div className="mt-20 flex ">
          {/* <h1>Hello World</h1> */}
          <div className="mr-7 ml-4 ">
            <button className="border-2 cursor-pointer h-9 w-20 rounded-lg hover:bg-gray-100 active:bg-gray-300 border-gray-400"><LINK href= "./SignUp">SignUp</LINK></button>
          </div>
          <div>
           <button className="border-2 cursor-pointer  h-9 w-20 rounded-lg hover:bg-gray-100 active:bg-gray-300 border-gray-400"><LINK href= "./SignIn">SignIn</LINK></button>
          </div>
          <div className="ml-10">
           <button className="border-2 cursor-pointer  h-9 w-20 rounded-lg hover:bg-gray-100 active:bg-gray-300 border-gray-400"><LINK href= "./Salesman">Salesman</LINK></button>
          </div>

    </div>
  );
}
