import React, { useEffect } from "react";
import classes from "./InputsDialog.module.scss";
import Image from "next/image";
import CustomSelect from "@/components/Admin/Dashboard/CustomSelect/CustomSelect";
import { useSelector, useDispatch } from "react-redux";
import {
	changeInputData,
	changeAreaSelect,
	changePaymentMethod,
} from "@/Redux/Reducers/HomeReducer";

function InputsDialog({
	isOpen,
	setIsOpen,
	roleValue,
	branches,
	payments,
	handleChange,
	getSelectedItem,
	discountType,
}) {
	const dispatch = useDispatch();
	const {
		InputsData: {
			TaxAmount,
			Sale,
			PhoneNumber,
			ClientName,
			ClientAddress,
			clientArea: { id },
			paymentMethod: { id: paymentId },
		},
	} = useSelector((state) => state.home);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") setIsOpen(false);
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "visible";
		};
	}, [isOpen, setIsOpen]);

	if (!isOpen) return null;

	return (
		<div className={classes.Dialog} onClick={() => setIsOpen(false)}>
			<div className={classes.Backdrop} />
			<div className={classes.Container}>
				<div className={classes.Panel}>
					<div
						className={classes.DialogPanel}
						onClick={(e) => e.stopPropagation()}
					>
						<div className={classes.Title}>تفاصيل الطلب</div>

						<div className={classes.Content}>
							<div className={classes.InputContainer}>
								<input
									type="tel"
									className={classes.Input}
									placeholder={"رقم الهاتف"}
									name={"PhoneNumber"}
									value={
										PhoneNumber != null ? PhoneNumber : ""
									}
									onInput={handleChange}
								/>
								<Image
									src={"/Icons/Phone.svg"}
									alt={"Phone icon"}
									width={20}
									height={20}
									className={classes.Icon}
								/>
							</div>
							<div className={classes.InputContainer}>
								<input
									type="text"
									className={classes.Input}
									placeholder={"اسم العميل"}
									name={"ClientName"}
									value={ClientName != null ? ClientName : ""}
									onInput={handleChange}
								/>
								<Image
									src={"/Icons/Client.svg"}
									alt={"Client icon"}
									width={20}
									height={20}
									className={classes.Icon}
								/>
							</div>
							<div className={classes.InputContainer}>
								<input
									type="text"
									className={classes.Input}
									placeholder={"العنوان"}
									name={"ClientAddress"}
									value={
										ClientAddress != null
											? ClientAddress
											: ""
									}
									onInput={handleChange}
								/>
								<Image
									src={"/Icons/Location.svg"}
									alt={"Location icon"}
									width={20}
									height={20}
									className={classes.Icon}
								/>
							</div>
							<div className={classes.InputContainer}>
								<CustomSelect
									label={"الفرع"}
									arrOfValue={branches}
									selectedValue={getSelectedItem(
										id,
										branches
									)}
									disabled={roleValue === "cashier"}
									change={(opt) => {
										dispatch(
											changeAreaSelect({
												label: opt?.label || "",
												id: opt?.value || "",
											})
										);
									}}
								/>
							</div>
							{roleValue === "cashier" && (
								<div className={classes.InputContainer}>
									<CustomSelect
										label={"وسيلة الدفع"}
										arrOfValue={payments}
										selectedValue={getSelectedItem(
											paymentId,
											payments
										)}
										change={(opt) => {
											dispatch(
												changePaymentMethod({
													label: opt?.label || "",
													id: opt?.value || "",
												})
											);
										}}
									/>
								</div>
							)}
							<div className={classes.InputContainer}>
								<input
									type="number"
									className={classes.Input}
									placeholder={"قيمة الضريبة"}
									disabled
									name={"TaxAmount"}
									value={TaxAmount > 0 ? TaxAmount : ""}
								/>
								<Image
									src={"/Icons/Percent.svg"}
									alt={"Percent icon"}
									width={20}
									height={20}
									className={classes.Icon}
								/>
							</div>
							<div className={classes.InputContainer}>
								<input
									type="number"
									className={classes.Input}
									disabled
									placeholder={"قيمة الخصم"}
									value={Sale > 0 ? Sale : ""}
									name={"Sale"}
								/>
								<Image
									src={
										discountType === "fixed"
											? "/Icons/Dollar.svg"
											: "/Icons/Percent.svg"
									}
									alt={"Dollar icon"}
									width={20}
									height={20}
									className={classes.Icon}
								/>
							</div>
						</div>

						<div className={classes.Actions}>
							<button
								type="button"
								className={classes.CloseButton}
								onClick={() => setIsOpen(false)}
							>
								إغلاق
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InputsDialog;
