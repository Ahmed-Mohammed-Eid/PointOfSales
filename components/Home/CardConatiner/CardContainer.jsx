import React, { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import Card from "./Card/Card";
import classes from "./CardContainer.module.scss";

const CardContainer = memo(() => {
	const { ItemsPreview } = useSelector((state) => state.home);

	const renderCard = useCallback(
		(item) => (
			<Card
				key={item._id}
				id={item._id}
				name={item.itemTitle}
				price={item.itemPrice}
				url={item.itemImage}
				unitId={item.unitId._id}
				unitValue={item.unitId.unitValue}
			/>
		),
		[]
	);

	return (
		<section
			className={classes.Container}
			role="grid"
			aria-label="Product grid"
		>
			{ItemsPreview.length > 0 ? (
				ItemsPreview.map(renderCard)
			) : (
				<div className={classes.EmptyState}>
					<p>No items available</p>
				</div>
			)}
		</section>
	);
});

CardContainer.displayName = "CardContainer";

export default CardContainer;
