"use client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "@/components/ui";
import { bookSchema } from "@/validations/books";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  TrashIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useBookStore } from "@/models/book.store";
import toast from "react-hot-toast";
import { useGenreStore } from "@/models/genre.store";
import { useDropzone } from "react-dropzone";

import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";
import { BookCreationDTO } from "@/types";
import { redirect, useRouter } from "next/navigation";

interface NewEditBookFormProps {
  isEdit?: boolean;
  currentBook?: BookCreationDTO;
}

export function NewEditBookForm(
  props: NewEditBookFormProps = { isEdit: false, currentBook: undefined }
) {
  const { isEdit, currentBook } = props;
  const router = useRouter();
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: currentBook?.title ?? "",
      author: currentBook?.author ?? "",
      publishedDate: currentBook?.publishedDate
        ? new Date(currentBook.publishedDate)?.toISOString()
        : undefined,
      isbn: currentBook?.isbn ?? "",
      photos: currentBook?.photos ?? ([] as any),
      price: currentBook?.price ?? 0,
      description: currentBook?.description ?? "",
      genre: currentBook?.genre ?? [],
      pdfUrl: currentBook?.pdfUrl ?? "",
      audioUrl: currentBook?.audioUrl ?? "",
    },
  });

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  const { upload, status, createBook, editBook } = useBookStore();
  const { genres } = useGenreStore();

  const date = form.getValues()["publishedDate"];

  const onSubmit = async (data: z.infer<typeof bookSchema>) => {
    try {
      if (isEdit) {
        await editBook(currentBook?.id as string, data);
        toast.success("Book edited successfully");
        return router.replace("/dashboard/books");
      }
      await createBook(data);
      toast.success("Book created successfully");
      form.reset();
      setAcceptedFiles([]);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleFileUpload = async (
    file: File,
    fieldName: "photos" | "pdfUrl" | "audioUrl"
  ) => {
    try {
      const data = await upload(
        file,
        fieldName === "photos"
          ? "image"
          : fieldName === "pdfUrl"
          ? "document"
          : "audio"
      );
      form.setValue(
        fieldName,
        fieldName === "photos" ? data.data : data.data[0],
        {
          shouldValidate: true,
        }
      );
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const onDrop = useCallback(
    (newFiles: File[]) => {
      const filteredFiles = newFiles.filter(
        (newFile) =>
          !acceptedFiles.some(
            (acceptedFile) => acceptedFile.name === newFile.name
          )
      );

      const availableSlots = 3 - acceptedFiles.length;

      if (availableSlots > 0) {
        const filesToAdd = filteredFiles.slice(0, availableSlots);
        setAcceptedFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
      }
    },
    [acceptedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 3,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
      "application/pdf": [],
      "audio/mpeg": [],
      "audio/mp3": [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    type="text"
                    placeholder="eg. Rich Dad Poor Dad"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Author</FormLabel>
                <FormControl>
                  <Input
                    id="author"
                    type="text"
                    placeholder="eg. Robert Kiyosaki"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description of the book"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Price</FormLabel>
                <FormControl>
                  <Input
                    id="price"
                    type="number"
                    placeholder="eg. 100.00"
                    {...field}
                    {...form.register("price", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Genre</FormLabel>
                <FormControl>
                  <Select
                    onChange={(value) => {
                      form.setValue(
                        "genre",
                        value.map((v) => v.value),
                        {
                          shouldValidate: true,
                        }
                      );
                    }}
                    onBlur={() => {
                      form.trigger("genre");
                    }}
                    defaultValue={
                      form.getValues()["genre"]?.map((genre) => ({
                        value: genre,
                        label: genres?.find((g) => g.id === genre)?.name,
                      })) ?? []
                    }
                    isMulti
                    name="genre"
                    options={genres?.map((genre) => ({
                      value: genre.id,
                      label: genre.name,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book ISBN</FormLabel>
                <FormControl>
                  <Input
                    id="isbn"
                    type="text"
                    placeholder="eg. 978-0-393-04102-9"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label
              className={cn(
                form.getFieldState("publishedDate")?.error && "text-destructive"
              )}
            >
              Published Date
            </Label>
            <div className="my-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",

                      form.getFieldState("publishedDate")?.isDirty &&
                        "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(new Date(date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      new Date(form.watch("publishedDate")) ?? new Date()
                    }
                    onSelect={(dateText) =>
                      form.setValue(
                        "publishedDate",
                        new Date(dateText as Date).toISOString(),
                        {
                          shouldValidate: true,
                        }
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {form.formState.errors.publishedDate && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.publishedDate.message}
              </div>
            )}
          </div>

          <FormItem>
            <FormLabel>Upload Cover, PDF and Audio of the Book</FormLabel>
            <div
              {...getRootProps()}
              className={cn(
                "border border-dashed border-gray-300 bg-background rounded-md p-10 hover:bg-gray-100 transition duration-300 ease-in-out",
                isDragActive && "border-primary"
              )}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-muted-foreground text-center">
                  Drop the files here ...
                </p>
              ) : (
                <div>
                  <p className={cn("text-muted-foreground text-center")}>
                    <span className="text-primary font-medium">
                      Upload a file
                    </span>{" "}
                    from your computer or drag and drop it here.
                    <span className="text-sm block mt-2">
                      <span className="text-muted-foreground">
                        Supported file types:{" "}
                      </span>
                      <span className="text-primary font-medium">
                        JPG, PNG, PDF, MP3{" "}
                        <span className="text-muted-foreground font-bold">
                          (Max 3 files)
                        </span>
                      </span>
                    </span>
                  </p>
                </div>
              )}
            </div>

            {form.formState.errors.photos ||
            form.formState.errors.pdfUrl ||
            form.formState.errors.audioUrl ? (
              <div className="text-sm font-medium text-destructive space-x-2">
                {/* display the errors like list */}
                <span>{form.formState.errors.photos?.message}</span>
                <span>{form.formState.errors.pdfUrl?.message}</span>
                <span>{form.formState.errors.audioUrl?.message}</span>
              </div>
            ) : null}
          </FormItem>

          {acceptedFiles.length > 0 && (
            <FormItem>
              <FormLabel>
                Accepted files: JPG, PNG, PDF, MP3 (Max 3 files)
              </FormLabel>
              <div className="p-4 border border-dashed border-gray-300 bg-background rounded-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {acceptedFiles.length} files
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {acceptedFiles.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="mr-2 h-9 w-9"
                            disabled={status === "pending"}
                            onClick={() => {
                              setAcceptedFiles(
                                acceptedFiles.filter(
                                  (f) => f.name !== file.name
                                )
                              );
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            loading={status === "pending"}
                            onClick={() => {
                              handleFileUpload(
                                file,
                                file.type.includes("image")
                                  ? "photos"
                                  : file.type.includes("pdf")
                                  ? "pdfUrl"
                                  : "audioUrl"
                              );
                            }}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FormItem>
          )}

          <div className="col-span-2 flex justify-end">
            <Button type="submit" size={"lg"} loading={status === "pending"}>
              {isEdit ? "Edit Book" : "Create Book"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
