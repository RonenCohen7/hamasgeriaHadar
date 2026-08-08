
import { toast, type ToastOptions, Slide, Bounce, Zoom,Flip } from "react-toastify";


export const notificationStyle = {
    fast: {
        autoClose: 1500,
        transition: Slide
    } satisfies ToastOptions,

    normal: {
        autoClose: 1500,
        transition: Slide
    } satisfies ToastOptions,

    slow: {
        autoClose: 6000,
        transition: Zoom
    } satisfies ToastOptions,

    warning: {
        autoClose: 5000,
        transition: Bounce
    } satisfies ToastOptions,

    error: {
        autoClose: 7000,
        transition: Flip
    }satisfies ToastOptions,

    sticky: {
        autoClose: false,
        closeOnClick: true,
        transition: Bounce
    }satisfies ToastOptions
};



class NotificationService {

    public success(message: string, options?: ToastOptions): void {
        toast.success(message, options);
    }

    public error(message: string, options?: ToastOptions): void {
        toast.error(message, options);
    }

    public warning(message: string, options?:ToastOptions): void {
        toast.warning(message, options);
    }

    public info(message: string, options?: ToastOptions): void {
        toast.info(message, options);
    }
}

export const notificationService = new NotificationService();