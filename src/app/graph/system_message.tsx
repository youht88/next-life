import { CodeMarkdownWidget } from "@/components/alt/code_markdown";

export default function SystemMessage({ ...props }) {
    return (
        <div className="rounded-sm px-2 py-1 bg-orange-300 text-black text-start">
            <CodeMarkdownWidget text={props.text} />
        </div>
    )
}