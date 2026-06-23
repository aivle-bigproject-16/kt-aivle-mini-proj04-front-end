import style from "@/common/components/ServiceLogo.module.css";

function TextLogo({ className, children }) {
  const classes = className
    ? `${style["text-logo"]} ${style[className]}`
    : style["text-logo"];
  return <h3 className={classes}>{children}</h3>;
}

function ServiceLogo({ className }) {
  return (
    <div className={style["service-logo"]}>
      <img src="/service-logo.svg" alt="서비스 로고" />
      <TextLogo className={className}>PIC:STORY</TextLogo>
    </div>
  );
}

export default ServiceLogo;
