import * as React from "react";
import KEY_CODES from "utils/keycodes";
import { Link } from "react-router-dom";

import { NavItems } from "config";

import styles from "./index.module.scss";

const Header = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const buttonRef = React.useRef<HTMLButtonElement>(
		null
	) as React.MutableRefObject<HTMLButtonElement>;
	const asideRef = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;

	type Focusables = HTMLButtonElement | HTMLAnchorElement;

	let menuFocusables: Focusables[] = [];
	let firstFocusableEl: Focusables | null = null;
	let lastFocusableEl: Focusables | null = null;

	const setFocusables = () => {
		menuFocusables = [buttonRef.current, ...Array.from(asideRef.current.querySelectorAll("a"))];
		firstFocusableEl = menuFocusables[0];
		lastFocusableEl = menuFocusables[menuFocusables.length - 1];
	};

	const handleBackwardTab = (e: KeyboardEvent) => {
		if (document.activeElement === firstFocusableEl) {
			e.preventDefault();
			lastFocusableEl && lastFocusableEl.focus();
		}
	};

	const handleForwardTab = (e: KeyboardEvent) => {
		if (document.activeElement === lastFocusableEl) {
			e.preventDefault();
			firstFocusableEl && firstFocusableEl.focus();
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case KEY_CODES.ESCAPE: {
				setIsOpen(false);
				break;
			}

			case KEY_CODES.TAB: {
				if (menuFocusables && menuFocusables.length === 1) {
					e.preventDefault();
					break;
				}
				if (e.shiftKey) {
					handleBackwardTab(e);
				} else {
					handleForwardTab(e);
				}
				break;
			}

			default: {
				break;
			}
		}
	};

	React.useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		setFocusables();

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	});

	return (
		<header className={styles.header}>
			<Link className={styles.header__logo} to="/" title="Home">
				BRAND BLOGS
			</Link>
			<nav className={styles.header__nav}>
				<ul className={styles.header__nav_list}>
					{NavItems.map((item) => (
						<li key={item.name}>
							<Link to={item.url}>{item.name}</Link>
						</li>
					))}
				</ul>
			</nav>
			<button
				aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
				className={`${styles.header__hamburger} ${isOpen ? styles.header__hamburger_active : ""}`}
				onClick={() => setIsOpen(!isOpen)}
				ref={buttonRef}
			>
				<svg height="32" width="32">
					<line className={styles.header__hamburger_top} x1="10%" y1="20%" x2="50%" y2="20%" />
					<line className={styles.header__hamburger_middle} x1="10%" y1="50%" x2="90%" y2="50%" />
					<line className={styles.header__hamburger_bottom} x1="50%" y1="80%" x2="90%" y2="80%" />
				</svg>
			</button>
			<aside
				ref={asideRef}
				className={`${styles.header__menu} ${isOpen ? styles.header__menu_open : ""}`}
				aria-hidden={!isOpen}
				tabIndex={isOpen ? 1 : -1}
			>
				<nav>
					<ul className={styles.header__menu_list}>
						{NavItems.map((item) => (
							<li key={item.name}>
								<Link onClick={() => setIsOpen(!isOpen)} to={item.url}>
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>
			{isOpen && (
				<button onClick={() => setIsOpen(!isOpen)} className={styles.header__backdrop}></button>
			)}
		</header>
	);
};

export default Header;
