import style from "@/common/components/Loading.module.css";

function Spinner() {
  return <div className={style.spinner}></div>;
}

function Message({ children }) {
  return <span className={style.message}>{children}</span>;
}

function Loading({ loading, message }) {
  if (!loading) return null;
  return (
    <div id={style.loading}>
      <Spinner />
      <Message>{message}</Message>
    </div>
  );
}

export default Loading;
