interface AnchorOrigin {
    vertical: "top" | "bottom" | "center";
    horizontal: "left" | "right" | "center";
}

interface BadgeProps {
    badgeContent?: string;
    children: React.ReactNode;
    variant?: "dot" | "standard";
    color?: string; // Optional: Background color of the badge (default is 'blue')
    textColor?: string; // Optional: Text color of the badge (default is 'text-white')
    anchorOrigin?: AnchorOrigin;
}

const Badge: React.FC<BadgeProps> = ({
    badgeContent,
    children,
    variant = "standard",
    color,
    textColor = "text-white",
    anchorOrigin = { vertical: "top", horizontal: "right" },
}) => {
    const verticalStyles = {
        top: "top-0 translate-y-[-50%]",
        bottom: "bottom-0 translate-y-[50%]",
        center: "top-1/2 -translate-y-1/2",
    };

    const horizontalStyles = {
        left: "left-0 transform -translate-x-1/2 ",
        right: "right-0 transform translate-x-1/2",
        center: "left-1/2 -translate-x-1/2",
    };

    const verticalClass = verticalStyles[anchorOrigin.vertical];
    const horizontalClass = horizontalStyles[anchorOrigin.horizontal];

    // // Add transform styles only if anchorOrigin specifies center
    // const transformClasses = [
    //     anchorOrigin.vertical === "center" ? "-translate-y-1/2" : "",
    //     anchorOrigin.horizontal === "center" ? "-translate-x-1/2" : "",
    // ]
    //     .filter(Boolean)
    //     .join(" ");
    return (
        <div className="relative inline-block">
            {children}
            {badgeContent && badgeContent !== "" && variant === "standard" && (
                <span
                    className={`absolute ${verticalClass} ${horizontalClass} inline-flex items-center justify-center px-2 py-1 leading-none rounded-md bg-szPrimary500 text-white text-caption-strong font-dmSans font-bold `}
                    style={{
                        backgroundColor: color ? `${color}` : "",
                        color: textColor ? `${textColor}` : "",
                    }}
                >
                    {badgeContent}
                </span>
            )}

            {variant === "dot" && (
                <span
                    className={`absolute ${verticalClass} ${horizontalClass} inline-flex items-center justify-center text-xs font-bold leading-none rounded-full w-3 h-3 bg-szPrimary500 text-white`}
                    style={{
                        backgroundColor: color ? `${color}` : "",
                        color: textColor ? `${textColor}` : "",
                    }}
                />
            )}
        </div>
    );
};
export default Badge;
