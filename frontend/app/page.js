"use client";
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
import Badge from "@/components/badge";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter,
} from "@/components/modal";
import { useState } from "react";

export default function Home() {
    const [open, setOpen] = useState(false);

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
        <div className="grid grid-cols-2 gap-4  my-12 mx-auto">
            <Button className="w-fit h-fit">Get started</Button>
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
                        <Button variant="secondary">View all</Button>
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
            <Badge status={"Approved"} className="w-fit h-fit" />

            <div>
                <Button onClick={() => setOpen(true)}>Open modal</Button>

                <Modal open={open}>
                    <ModalHeader className="flex items-start justify-between gap-4">
                        <div>
                            <ModalTitle>Review application</ModalTitle>
                            <ModalDescription>
                                Check the submission details before approving
                                the request.
                            </ModalDescription>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(91,97,110,0.2)] bg-[#eef0f3] text-[#0a0b0d] transition-colors duration-200 hover:bg-[#dfe3e8] focus:outline-none focus:ring-2 focus:ring-black"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </ModalHeader>

                    <ModalContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-[14px] font-semibold text-[#0a0b0d]">
                                    Student name
                                </label>
                                <Input placeholder="Enter student name" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[14px] font-semibold text-[#0a0b0d]">
                                    Company
                                </label>
                                <Input placeholder="Enter company name" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[14px] font-semibold text-[#0a0b0d]">
                                    Notes
                                </label>
                                <Textarea
                                    rows={4}
                                    placeholder="Add any notes or comments..."
                                />
                            </div>
                        </div>
                    </ModalContent>

                    <ModalFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => setOpen(false)}>Approve</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
}
