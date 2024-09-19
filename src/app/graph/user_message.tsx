export default function UserMessage({...props}) {
    return (
        <div className="rounded-sm px-2 py-1 bg-gray-100 text-black"> {props.text} </div>
    )
 }