import { useState } from "react";
import {
    FaCreditCard,
    FaMoneyBillWave,
    FaMobileAlt
} from "react-icons/fa";
import { PaymentMethod } from "../../models/enum";
import type { VipCardModel } from "../../models/vip-card-model";
import { vipCardService } from "../../service/vipCardService";
import { dialogService } from "../../service/dialogService";
import { useNavigate } from "react-router-dom";



interface PaymentModalProps {
    saleId: number;
    totalAmount: number;
    isSubmitting: boolean;
    onClose: () => void;

    onConfirm: (
        paymentMethod: PaymentMethod,
        vipCard: VipCardModel | null
    ) => Promise<void>;
}

export function PaymentModal(props: PaymentModalProps) {

    const {
        saleId,
        totalAmount,
        isSubmitting,
        onClose,
        onConfirm
    } = props;


    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>(PaymentMethod.Cash);

    const [receivedAmount, setReceivedAmount] =
        useState(totalAmount.toFixed(2));

    const [selectedVipCard, setSelectedVipCard] =
        useState<VipCardModel | null>(null);

    const [vipCardNumber, setVipCardNumber] =
        useState("");

    const [phoneLast4, setPhoneLast4] =
        useState("");

    const [vipVerified, setVipVerified] =
        useState(false);


    const receivedNumber =
        Number(receivedAmount) || 0;

    const changeAmount =
        paymentMethod === PaymentMethod.Cash
            ? Math.max(receivedNumber - totalAmount, 0)
            : 0;

    const isVipPayment =
        paymentMethod === PaymentMethod.VIPCard;


    async function searchVipCard() {

        if (!vipCardNumber.trim()) {
            await dialogService.error("Please enter VIP card number", "💳")

            return;
        }

        try {

            const card =
                await vipCardService.getCardByCardNumber(
                    vipCardNumber.trim()
                );

            setSelectedVipCard(card);

            setVipVerified(false);
            setPhoneLast4("");

            await dialogService.success(
                "VIP Card found", "📱"
            );

        }
        catch (err) {

            console.error(err);

            setSelectedVipCard(null);

            await dialogService.error(
                "📱 🔍", "VIP Card not found"
            );
        }
    }


    async function verifyVipCard() {

        if (!selectedVipCard) return;

        if (!/^\d{4}$/.test(phoneLast4)) {

            await dialogService.error(
                "📱 ④ ", "Please enter the last 4 digits of the phone number"
            );

            return;
        }

        try {

            const verified =
                await vipCardService.verifyCardPhone(
                    selectedVipCard.idVipCard,
                    phoneLast4
                );

            if (!verified) {

                await dialogService.error(
                    "😞", "Phone verification failed"
                );

                return;
            }

            setVipVerified(true);

            await dialogService.success(
                "😊", "Customer verified"
            );

        }
        catch (err) {

            console.error(err);

            await dialogService.error(
                "😞", "Verification failed"
            );
        }
    }


    async function confirmPayment() {

        if (
            paymentMethod === PaymentMethod.Cash &&
            receivedNumber < totalAmount
        ) {
            await dialogService.error(
                "💵", "Received amount is lower than total"
            );
            return;
        }

        if (paymentMethod === PaymentMethod.VIPCard) {

            if (!selectedVipCard) {
                await dialogService.error(
                    "💳", "Please select a VIP Card"
                );
                return;
            }

            if (!vipVerified) {
                await dialogService.error(
                    "👤", "Please verify the customer first"
                );
                return;
            }

            if (
                Number(selectedVipCard.balance) < totalAmount) {

                await dialogService.error(
                    "💵", "VIP Card balance is too low"
                );

                onClose()

                navigate(`/vip-cards/${selectedVipCard.idVipCard}/recharge`,{
                    state : {
                        returnTo: window.location.pathname,
                        idSale: saleId,
                        idVipCard: selectedVipCard.idVipCard,
                        paymentMethod: PaymentMethod.VIPCard
                    }
                })
                return;

            }
        }

        await onConfirm(
            paymentMethod,
            selectedVipCard
        );
    }


    return (
        <div
            className="quick-sale-payment-overlay"
            onClick={() => {
                if (!isSubmitting) {
                    onClose();
                }
            }}
        >

            <div
                className="quick-sale-payment-modal"
                onClick={event =>
                    event.stopPropagation()
                }
            >

                <div className="quick-sale-payment-header">

                    <div>
                        <span>PAYMENT</span>
                        <h2>Complete Sale</h2>
                    </div>

                    <button
                        type="button"
                        className="quick-sale-payment-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        X
                    </button>

                </div>


                <div className="quick-sale-payment-total">

                    <span>Total</span>

                    <strong>
                        ₪{totalAmount.toFixed(2)}
                    </strong>

                </div>


                <div className="quick-sale-payment-section">

                    <label>
                        Payment Method
                    </label>


                    {!isVipPayment ? (

                        <div className="quick-sale-payment-methods">

                            <button
                                type="button"
                                className="vip-card"
                                onClick={() =>
                                    setPaymentMethod(
                                        PaymentMethod.VIPCard
                                    )
                                }
                            >
                                <FaCreditCard />
                                VIP Card
                            </button>


                            <button
                                type="button"
                                className={
                                    paymentMethod === PaymentMethod.Cash
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        PaymentMethod.Cash
                                    )
                                }
                            >
                                <FaMoneyBillWave />
                                Cash
                            </button>


                            <button
                                type="button"
                                className={
                                    paymentMethod === PaymentMethod.CreditCard
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        PaymentMethod.CreditCard
                                    )
                                }
                            >
                                <FaCreditCard />
                                Credit Card
                            </button>


                            <button
                                type="button"
                                className={
                                    paymentMethod === PaymentMethod.Bit
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        PaymentMethod.Bit
                                    )
                                }
                            >
                                <FaMobileAlt />
                                Bit
                            </button>


                            <button
                                type="button"
                                className={
                                    paymentMethod === PaymentMethod.PayBox
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        PaymentMethod.PayBox
                                    )
                                }
                            >
                                <FaMobileAlt />
                                PayBox
                            </button>

                        </div>

                    ) : (

                        <button
                            type="button"
                            className="quick-sale-change-payment"
                            onClick={() => {

                                setPaymentMethod(
                                    PaymentMethod.Cash
                                );

                                setSelectedVipCard(null);
                                setVipCardNumber("");
                                setPhoneLast4("");
                                setVipVerified(false);
                            }}
                        >
                            Change Payment Method
                        </button>

                    )}


                    {isVipPayment && (

                        <div className="quick-sale-vip-search">

                            <label>
                                VIP Card Number
                            </label>

                            <input
                                type="text"
                                placeholder="ENTER VIP Card Number - Full Number"
                                value={vipCardNumber}
                                onChange={event =>
                                    setVipCardNumber(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={searchVipCard}
                            >
                                Search
                            </button>

                        </div>

                    )}

                </div>


                {selectedVipCard && (

                    <div className="quick-sale-vip-info">

                        {!vipVerified && (

                            <div className="quick-sale-vip-verify">

                                <label>
                                    Enter last 4 digits of customer's phone
                                </label>

                                <input
                                    type="text"
                                    maxLength={4}
                                    value={phoneLast4}
                                    onChange={event =>
                                        setPhoneLast4(
                                            event.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={verifyVipCard}
                                >
                                    Verify
                                </button>

                            </div>

                        )}


                        <div>
                            <span>Customer</span>

                            <strong>
                                {selectedVipCard.firstName}
                                {" "}
                                {selectedVipCard.lastName}
                            </strong>
                        </div>


                        <div>
                            <span>Card Number</span>

                            <strong>
                                {selectedVipCard.cardNumber}
                            </strong>
                        </div>


                        <div>
                            <span>Balance</span>

                            <strong>
                                ₪
                                {Number(
                                    selectedVipCard.balance
                                ).toFixed(2)}
                            </strong>
                        </div>

                    </div>

                )}


                {paymentMethod === PaymentMethod.Cash && (

                    <div className="quick-sale-payment-cash">

                        <label htmlFor="receivedAmount">
                            Received Amount
                        </label>

                        <input
                            id="receivedAmount"
                            type="number"
                            min={0}
                            step="0.01"
                            value={receivedAmount}
                            onChange={event =>
                                setReceivedAmount(
                                    event.target.value
                                )
                            }
                        />


                        <div className="quick-sale-change-row">

                            <span>Change</span>

                            <strong>
                                ₪{changeAmount.toFixed(2)}
                            </strong>

                        </div>

                    </div>

                )}


                <div className="quick-sale-payment-actions">

                    <button
                        type="button"
                        className="quick-sale-payment-cancel"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="quick-sale-payment-confirm"
                        onClick={confirmPayment}
                        disabled={
                            isSubmitting ||
                            (
                                paymentMethod === PaymentMethod.Cash &&
                                receivedNumber < totalAmount
                            )
                        }
                    >
                        {isSubmitting
                            ? "Processing"
                            : "Confirm"}
                    </button>

                </div>

            </div>

        </div>
    );
}