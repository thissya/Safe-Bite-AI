import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from "framer-motion";

const EmailForm = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_6jqypys', 'template_yaaoluw', form.current, 'ly_nVFO9rdZJp_bHB')
            .then(
                (result) => {
                    console.log(result.text);
                    e.target.reset();
                    alert('Email sent!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                }
            );
    };

    const inputVariants = {
        focus: { scale: 1.05, borderColor: '#6b7280', transition: { duration: 0.3 } }, // Gray-500
        initial: { scale: 1, borderColor: '#d1d5db' } // Gray-300
    };

    return (
        <div className="flex items-center justify-center min-h-screen"> {/* This will center the form */}
            <div className="border-b border-neutral-900 pb-20 flex items-center justify-center">
                <motion.h1
                    whileInView={{ x:0, opacity: 1 }}
                    initial={{ x:-100, opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="my-20 text-center text-2xl"
                >
                    <p className='font-bold'>Have ideas or feedback to enhance our project?</p><br />
                    <p className="font-bold">Got questions or need clarification? </p><br />
                    <p className='font-bold text-purple-400'>We’re here to collaborate, listen, and make it better together-let’s connect!</p>
                </motion.h1>

                <motion.h1
                    whileInView={{ x:0, opacity: 1 }}
                    initial={{ x:100, opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                <form className="space-y-4 " ref={form} onSubmit={sendEmail}>
                    <motion.input
                        type="text"
                        className="w-3/4 p-2 border border-gray-300 bg-neutral-100 text-neutral-900 rounded-md transition-transform duration-300 ease-in-out"
                        placeholder="Your Name"
                        name="your_name"
                        aria-label="Your Name"
                        required
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                    />
                    <motion.input
                        type="email"
                        className="w-3/4 p-2 border border-gray-300 bg-neutral-100 text-neutral-900 rounded-md transition-transform duration-300 ease-in-out"
                        placeholder="Your Email"
                        name="your_email"
                        aria-label="Your Email"
                        required
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                    />
                    <motion.textarea
                        className="w-3/4 p-2 border border-gray-300 bg-neutral-100 text-neutral-900 rounded-md transition-transform duration-300 ease-in-out"
                        name="message"
                        rows="4"
                        placeholder="Your Message"
                        aria-label="Your Message"
                        required
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                    ></motion.textarea>
                    <motion.button
                        type="submit"
                        value="Send"
                        className="w-3/4 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-transform duration-300 ease-in-out"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Submit
                    </motion.button>
                </form>
                </motion.h1>
            </div>
        </div>
    );
};

export default EmailForm;
