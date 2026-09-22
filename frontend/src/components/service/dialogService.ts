import Swal from "sweetalert2";


class DialogService {

    public async bitPayment(
    amount: number,
    qrImage: string,
    texts: {
        title: string;
        transfer: string;
        details: string;
        instructions: string;
        confirm: string;
        cancel: string;
    }
): Promise<boolean> {

    const result = await Swal.fire({
        title: texts.title,

        html: `
            <div dir="rtl" style="text-align:center">
                <p>${texts.transfer}</p>

                <h2 style="margin:16px 0">
                    ${amount.toLocaleString()} ₪
                </h2>

                <img
                    src="${qrImage}"
                    alt="Bit QR"
                    style="
                        width: 220px;
                        height: 280px;
                        object-fit: cover;
                        object-position: center;
                        display: block;
                        margin: 15px auto;
                    "
                />

                <p style="margin-top:20px">
                    ${texts.instructions}
                </p>
            </div>
        `,

        icon: "info",
        showCancelButton: true,

        confirmButtonText: texts.confirm,
        cancelButtonText: texts.cancel,

        confirmButtonColor: "#198245",
        cancelButtonColor: "#6c757d",

        reverseButtons: true
    });

    return result.isConfirmed;
}
    
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