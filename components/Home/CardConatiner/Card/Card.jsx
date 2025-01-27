import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import classes from "./Card.module.scss";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { AddItem } from "@/Redux/Reducers/HomeReducer";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str) =>
	typeof window === "undefined"
		? Buffer.from(str).toString("base64")
		: window.btoa(str);

const Card = memo(({ id, name, price, category, url, unitId, unitValue }) => {
	const [selected, setSelected] = useState(false);
	const [imageError, setImageError] = useState(false);

	const dispatch = useDispatch();
	const { Items } = useSelector((state) => state.home);

	useEffect(() => {
		setSelected(Items.some((item) => item.name === name));
	}, [Items, name]);

	const handleImageError = () => {
		setImageError(true);
	};

	const onCardClickedHandler = () => {
		dispatch(
			AddItem({
				id,
				name,
				price,
				quantity: 1,
				category,
				unitId,
				unitValue,
			})
		);
	};

	const formattedPrice = `${Number(price).toFixed(3)} KWD`;
	const imageSrc = imageError || !url ? "/Images/Image_notfound.png" : url;

	return (
		<article
			className={`${classes.Card} ${selected ? classes.Selected : ""}`}
			onClick={onCardClickedHandler}
			role="button"
			tabIndex={0}
			aria-label={`Select ${name}, Price: ${formattedPrice}`}
		>
			<div className={classes.Image_Container}>
				<Image
					className={classes.Image}
					src={imageSrc}
					alt={name}
					width={220}
					height={180}
					priority={false}
					onError={handleImageError}
					placeholder="blur"
					blurDataURL={`data:image/svg+xml;base64,${toBase64(
						shimmer(220, 180)
					)}`}
				/>
			</div>
			<span className={classes.Price}>{formattedPrice}</span>
			<div className={classes.Content}>
				<h3 title={name}>{name}</h3>
				{category && <p title={category}>{category}</p>}
			</div>
		</article>
	);
});

Card.displayName = "Card";

export default Card;
