import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/img1.jpg";

const contacts = [
    { name: "THISYAKKANNA S M", email: "thissya129@gmail.com" },
    { name: "MONIKA R J", email: "monikajothi07@gmail.com" },
    { name: "VARSHINI S H", email: "varshinish@gmail.com" },
];

function Contact() {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="text-center pb-8 border-b border-neutral-900">
            <motion.h1
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-20 text-center text-purple-400 text-5xl font-serif"
            >
                Contact
            </motion.h1>

            <div className="flex flex-col items-center space-y-6">
                {contacts.map((contact, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center p-4 w-3/4 bg-[#282842] rounded-md shadow-md"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="w-12 h-12 bg-purple-600 rounded-md mr-4"></div>
                        <div>
                            <p className="text-lg font-bold">{contact.name}</p>
                            <p className="text-sm text-gray-300">{contact.email}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Contact;
