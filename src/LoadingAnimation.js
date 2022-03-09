import './styles/loadingAnimation.css';

function LoadingAnimation(props) {
    const task = props.task;

    return (
        <>
            <div className="lds-ripple"><div></div><div></div></div>
            <p>This may take some time. <br/> Do not refresh the page. <br /> <br /> &#8987; {task}...</p>
        </>
    )
}

export default LoadingAnimation;
