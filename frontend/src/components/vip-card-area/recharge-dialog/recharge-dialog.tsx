import "./recharge-dialog.css";

interface RechargeDialogProps {
    balance: number;
    total: number;
    missing: number;
    onCancel: () => void;
    onRecharge: () => void;
}

export function RechargeDialog({
    balance,
    total,
    missing,
    onCancel,
    onRecharge
}: RechargeDialogProps) {

    return (
        <div className="recharge-dialog-overlay">
            <div className="recharge-dialog">

                <h2>Insufficient VIP Balance</h2>

                <p>
                    Current Balance:
                    <strong> ₪{balance.toFixed(2)}</strong>
                </p>

                <p>
                    Sale Total:
                    <strong> ₪{total.toFixed(2)}</strong>
                </p>

                <p>
                    Missing:
                    <strong> ₪{missing.toFixed(2)}</strong>
                </p>

                <div className="recharge-dialog-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onRecharge}
                    >
                        Recharge Card
                    </button>
                </div>

            </div>
        </div>
    );
}