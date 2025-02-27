"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import getMongoUserId from "@/components/shared/GetMongouserDetails";
import { createContactus } from "../../../lib/actions/contactus.action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const authorID = useRef<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getMongoUserId();
      authorID.current = id;
    };
    if (!authorID.current) {
      fetchUserId();
    }
  }, []);

  const defaultValues = {
    email: "",
    author: authorID.current!,
    subject: "",
    message: "",
  };

  const form = useForm({
    defaultValues,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createContactus({
        email,
        author: authorID.current!,
        subject,
        message,
      });
      alert(response.message);
      setIsSubmitting(false);
      setSubject("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="mt-9 flex w-full flex-col gap-9">
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Email <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Subject <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Subject"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                  onChange={(event) => setSubject(event.target.value)}
                  value={subject}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Message <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[450px] border"
                  {...field}
                  onChange={(event) => setMessage(event.target.value)}
                  value={message}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
