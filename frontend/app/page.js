import Button from "@/components/button";
import Input from "@/components/input";

export default function Home() {
    return (
        <div className="flex flex-col gap-4 max-w-60 mx-auto">
            <Button>Get started</Button>
            <Input placeholder="hi" />
        </div>
    );
}
