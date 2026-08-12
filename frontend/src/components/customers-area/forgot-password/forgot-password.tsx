import "./forgot-password.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "../../utils/UseTitle";
import { dialogService } from "../../service/dialogService";
import { customerService } from "../../service/customerService";


export function ForgotPassword() {

    useTitle("Forgot Password");

    const navigate = useNavigate();


    const [step, setStep] =
        useState<1 | 2 | 3>(1);


    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [birthDate, setBirthDate] =
        useState("");


    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    const [resetToken, setResetToken] =
        useState<string | null>(null);


    const [isSubmitting, setIsSubmitting] =
        useState(false);


    // =========================================
    // STEP 1 - CHECK EMAIL
    // =========================================

    async function checkEmail() {

        if (!email.trim()) {

            await dialogService.error(
                "Email Required",
                "Please enter your email"
            );

            return;
        }


        if (!email.includes("@")) {

            await dialogService.error(
                "Invalid Email",
                "Please enter a valid email address"
            );

            return;
        }


        setIsSubmitting(true);

        try {

            //step -1
            await customerService.checkForgotPasswordEmail(email.trim())

            setStep(2);

        } catch {

            await dialogService.error(
                "Account Not Found",
                "We couldn't find an account with that email"
            );

            setEmail("");

        } finally {

            setIsSubmitting(false);
        }
    }



    // =========================================
    // STEP 2 - VERIFY CUSTOMER
    // =========================================

    async function verifyCustomer() {

        if (!phone.trim()) {

            await dialogService.error(
                "Phone Required",
                "Please enter your phone number"
            );

            return;
        }


        if (!birthDate) {

            await dialogService.error(
                "Birth Date Required",
                "Please enter your birth date"
            );

            return;
        }


        setIsSubmitting(true);

        try {

            const result =
                await customerService.verifyForgotPasswordCustomer(
                    email,
                    phone,
                    birthDate
                );

            setResetToken(result.resetToken);
            setStep(3);

            console.log({
                email,
                phone,
                birthDate
            });


        } catch {

            await dialogService.error(
                "Verification Failed",
                "The details you entered don't match our records"
            );

        } finally {

            setIsSubmitting(false);
        }
    }



    // =========================================
    // STEP 3 - NEW PASSWORD
    // =========================================

    async function changePassword() {

        if (!newPassword.trim()) {

            await dialogService.error(
                "Password Required",
                "Please enter a new password"
            );

            return;
        }

           
        if (newPassword.length < 6) {
            console.log("New Password ENTER: ", newPassword);
            
            await dialogService.error(
                "Password Too Short",
                "Password must contain at least 6 characters"
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            await dialogService.error(
                "Passwords Do Not Match",
                "Please make sure both passwords are identical"
            );

            return;
        }


        if (!resetToken) {

            await dialogService.error(
                "Verification Required",
                "Please verify your account first"
            );

            return;
        }


        setIsSubmitting(true);

        try {

            await customerService.resetForgotPassword(
                resetToken,
                newPassword
            );

            await dialogService.success?.( 
                "Password Changed",
                "Your password has been reset successfully"
            );

            navigate("/customer-login");

        } catch (err){
            console.error("RESET PASSWORD ERROR: ",err)
            await dialogService.error(
                "Something Went Wrong",
                "We couldn't reset your password. Please try again"
            );

        } finally {

            setIsSubmitting(false);
        }
    }



    return (

        <section className="ForgotPassword">

            <div className="forgot-password-card">


                <span className="forgot-password-badge">
                    Customer Portal
                </span>


                <h1>
                    Forgot Password
                </h1>



                {/* =================================
                    STEP 1
                ================================= */}

                {step === 1 && (

                    <>

                        <p>
                            Enter the email address
                            connected to your account.
                        </p>


                        <div className="forgot-password-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                placeholder="example@email.com"
                                onChange={e =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            type="button"
                            className="forgot-password-main-button"
                            onClick={checkEmail}
                            disabled={isSubmitting}
                        >
                            Continue
                        </button>

                    </>

                )}



                {/* =================================
                    STEP 2
                ================================= */}

                {step === 2 && (

                    <>

                        <p>
                            We found your account.
                            Please verify your identity.
                        </p>


                        <div className="forgot-password-field">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                value={phone}
                                placeholder="050-0000000"
                                onChange={e =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="forgot-password-field">

                            <label>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                value={birthDate}
                                onChange={e =>
                                    setBirthDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            type="button"
                            className="forgot-password-main-button"
                            onClick={verifyCustomer}
                            disabled={isSubmitting}
                        >
                            Verify Customer
                        </button>

                    </>

                )}



                {/* =================================
                    STEP 3
                ================================= */}

                {step === 3 && (

                    <>

                        <p>
                            Account verified.
                            Choose your new password.
                        </p>


                        <div className="forgot-password-field">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                placeholder="New password"
                                onChange={e =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="forgot-password-field">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm password"
                                onChange={e =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            type="button"
                            className="forgot-password-main-button"
                            onClick={changePassword}
                            disabled={isSubmitting}
                        >
                            Change Password
                        </button>

                    </>

                )}



                {/* BACK */}

                <button
                    type="button"
                    className="forgot-password-back"
                    onClick={() =>
                        navigate("/customer-login")
                    }
                >
                    ← Back to Login
                </button>


            </div>

        </section>
    );
}