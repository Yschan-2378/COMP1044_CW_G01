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
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/table";

export default function Home() {
    const students = [
        {
            id: 1,
            name: "Alice Tan",
            company: "Grab",
            status: "Approved",
        },
        {
            id: 2,
            name: "John Lee",
            company: "Shopee",
            status: "Pending",
        },
    ];

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

            <Table>
                <TableHeader>
                    <TableRow className="border-t-0">
                        <TableHead>Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {students.length === 0 ? (
                        <TableEmpty colSpan={3} />
                    ) : (
                        students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.company}</TableCell>
                                <TableCell>{student.status}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
