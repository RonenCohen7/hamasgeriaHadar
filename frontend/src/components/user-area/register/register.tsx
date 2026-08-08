import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useTitle } from "../../utils/UseTitle";
import { useForm } from "react-hook-form";
import { RegisterUserDto } from "../../models/user-model";
import { notificationService } from "../../service/notificationService";
import { authService } from "../../service/authService";
import { UserRole } from "../../models/enum";

export function Register() {


    const title = useTitle("Register");
    const navigate = useNavigate();

    const { register, handleSubmit,reset, formState: { errors } } = useForm<RegisterUserDto>();


    async function send(user: RegisterUserDto) {
        try {
            user.role = UserRole.Employee

            await authService.register(user);
            notificationService.success("User registered successfully");
            reset();
            navigate("/login")

        } catch (err: any) {
            notificationService.error(err.message)
        }
    }






    return (
        <section className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <span>Welcome Back</span>
                    <h1>HAMASGERYA- Hadar Pub</h1>
                    <p>Sign in to access the management dashboard</p>
                </div>


                <form className="register-form" onSubmit={handleSubmit(send)}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" placeholder="Enter your First Name" {...register("firstName", { required: true })} />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="Enter your Last Name" {...register("lastName", { required: true })} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" placeholder="Enter your Email" {...register("email", { required: true })} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" {...register("password", { required: true })} />
                    </div>

            
                    <button type="submit">Register</button>

                    <div className="register-link">
                        <span>Have account ?</span>
                        <Link to="/login"> Login</Link>
                    </div>

                </form>
            </div>

        </section>
    );
}
