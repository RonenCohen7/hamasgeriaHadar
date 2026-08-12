import Swal from "sweetalert2";


class DialogService {
    
    public async confirm(
        title: string,
        text:string,
        confirmText: string = "Confirm",
        cancelText: string = "Cancel"
    ): Promise<boolean>{

        const result = await Swal.fire({
            title,
            text,
            icon:"warning",

            showCancelButton: true,

            confirmButtonText: confirmText,
            cancelButtonText: cancelText,

            confirmButtonColor: "#198245",
            cancelButtonColor: "#6c757d",

            reverseButtons: true
        })
        return result.isConfirmed;
    }


    public async error(title:string,text: string): Promise<void>{
        await Swal.fire({
            title,
            text,
            icon: "error",
            confirmButtonText:"ok",
            confirmButtonColor: "#190245"
        })
    }

    public async success(title:string, text: string): Promise<void>{
        await Swal.fire({
            title,
            text,
            icon: "success",
            confirmButtonText: "ok",
            confirmButtonColor: "#198245"
        })
    }

}

export const dialogService = new DialogService();