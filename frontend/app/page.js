import Button from "@/components/button";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/card";
import Label from "@/components/label";

export default function Home() {
    return (
        <div className="flex flex-col gap-4 max-w-96 mt-12 mx-auto">
            <Button>Get started</Button>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
            </div>
            <Textarea placeholder="Some long text here" />

            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Student count</CardTitle>
                    <CardDescription>Students in the system</CardDescription>
                </CardHeader>

                <CardContent className="flex gap-4 flex-col">
                    <div className="text-5xl ">498</div>
                    <div className="w-full flex justify-end">
                        <Button>View all</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
