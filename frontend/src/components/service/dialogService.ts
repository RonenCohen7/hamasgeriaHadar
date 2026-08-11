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

}

export const dialogService = new DialogService();