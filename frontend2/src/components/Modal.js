export const Modal = ({content, id, fitContent}) =>{
    return(
        <>
            <input type="checkbox" id={id} className="modal-toggle "/>
    <div className={`modal ${!fitContent ? "w-[100%]" : ""}`}>
        <div className={`modal-box ${!fitContent ? "max-w-[75%]" : ""}`} style={{borderRadius: 0}}>
            <div className={'px-3 py-4'}>
                {content}
            </div>
            <div className="modal-action">
                <label htmlFor={id} className="btn">Done</label>
            </div>
        </div>
    </div>
        </>
)
}