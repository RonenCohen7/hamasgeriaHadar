
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTitle } from "../../utils/UseTitle";
import { LoginUserDto } from "../../models/user-model";
import { authService } from "../../service/authService";
import { notificationService } from "../../service/notificationService";
import { FaHome } from "react-icons/fa";



export function Login() {


    useTitle("Login");
    const  { register,handleSubmit, reset } = useForm<LoginUserDto>();
    const navigate = useNavigate();

    async function send(credentials:LoginUserDto){
        try{
            await authService.login(credentials);
            notificationService.success("Welcome");
            reset()
            navigate("/")

        }catch(err:any){
            notificationService.error(err.message)
        }
    }




    return (
        <section className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <span>Welcome Back</span>
                    <h1>HAMASGERYA- Hadar Pub</h1>
                    <p>Sign in to access the management dashboard</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit(send)}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your Email" {...register("email", {required:true})}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password"autoComplete="current-password" placeholder="Enter your password"{...register("password",{required:true})}/>
                    </div>
                    <button type="submit">Login</button>

                    <div className="register-link">
                        <span>Don't have account</span>
                        <Link to="/register"> Create Account</Link>
                    </div>

                </form>

                <p className="customer-access">
                    Customer?
                    <button
                        type="button"
                        onClick={()=> navigate("/customer-login")}>
                            Customer Login
                        </button>

                </p>

                  <button
                        type="button"
                        onClick={()=>navigate("/")}
                        >
                    <FaHome size={15} color="red" />
                                        
                </button>
            </div>
            

        </section>
    );
}
