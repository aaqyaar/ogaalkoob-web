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
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import { PaymentMethod, PurchaseCreationDTO } from "@/types";
import { useRouter } from "next/navigation";
import { purchaseSchema } from "@/validations/purchase";
import { usePurchaseStore } from "@/models/purchase.store";
import { PurchaseLocalStoreProps } from "@/app/dashboard/purchases/new/page";
import clsx from "clsx";

interface NewEdiPurchaseFormProps {
  isEdit?: boolean;
  currentPurchase?: PurchaseCreationDTO;
  _data: PurchaseLocalStoreProps;
}

export function NewEditPurchaseForm(
  props: NewEdiPurchaseFormProps = {
    isEdit: false,
    currentPurchase: undefined,
    _data: { users: [], books: [] },
  }
) {
  const {
    isEdit,
    currentPurchase,
    _data: { users, books },
  } = props;
  const router = useRouter();
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      userId: currentPurchase?.userId ?? "",
      books: currentPurchase?.books ?? [],
      amount: currentPurchase?.amount ?? 0,
      paymentMethod: currentPurchase?.paymentMethod ?? PaymentMethod.MMT,
      phoneNumber: currentPurchase?.phoneNumber ?? "",
      purchaseDate: currentPurchase?.purchaseDate
        ? new Date(currentPurchase.purchaseDate)?.toISOString()
        : new Date().toISOString(),
    },
  });

  const { createPurchase, status } = usePurchaseStore();

  const onSubmit = async (data: z.infer<typeof purchaseSchema>) => {
    console.log(data);
    try {
      if (isEdit) {
        // TODO: edit purchase
        return;
      }
      await createPurchase(data);
      toast.success("Purchase created successfully");
      form.reset();
      router.push("/dashboard/purchases");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong");
    }
  };

  const controlStyles = {
    base: "rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    focus:
      "placeholder:text-muted-foreground visible:outline-none visible:ring-2 visible:ring-ring visible:ring-offset-2",
    nonFocus: "border-gray-300 hover:border-gray-400",
  };
  const placeholderStyles = "text-gray-500 pl-1 py-0.5";
  const selectInputStyles = "pl-1 py-0.5";
  const valueContainerStyles = "p-1 gap-1";
  const singleValueStyles = "leading-7 ml-1";
  const multiValueStyles =
    "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
  const multiValueLabelStyles = "leading-6 py-0.5";
  const multiValueRemoveStyles =
    "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
  const indicatorsContainerStyles = "p-1 gap-1";
  const clearIndicatorStyles =
    "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
  const indicatorSeparatorStyles = "bg-gray-300";
  const dropdownIndicatorStyles =
    "p-1 hover:bg-gray-100 text-gray-300 rounded-md hover:text-black";
  const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
  const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
  const optionStyles = {
    base: "hover:cursor-pointer px-3 py-2 rounded",
    focus: "bg-gray-100 active:bg-gray-200",
    selected:
      "after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500",
  };
  const noOptionsMessageStyles =
    "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 grid-cols-2">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.MMT}>
                      {PaymentMethod.MMT}
                    </SelectItem>

                    <SelectItem value={PaymentMethod.CARD}>
                      {PaymentMethod.CARD}
                    </SelectItem>

                    <SelectItem value={PaymentMethod.CASH}>
                      {PaymentMethod.CASH}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input id="phoneNumber" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="books"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select books to buy</FormLabel>
                <FormControl>
                  <ReactSelect
                    onChange={(value) => {
                      form.setValue(
                        "books",
                        value.map((v) => v.value),
                        {
                          shouldValidate: true,
                        }
                      );

                      const amount = value.reduce((acc, curr) => {
                        const book = books.find(
                          (book) => book.id === curr.value
                        );
                        return acc + (book ? book.price : 0);
                      }, 0);

                      form.setValue("amount", amount, {
                        shouldValidate: true,
                      });
                    }}
                    onBlur={() => {
                      form.trigger("books");
                    }}
                    defaultValue={
                      form.getValues()["books"]?.map((book) => ({
                        value: book,
                        label: books?.find((g) => g.id === book)?.title,
                      })) ?? []
                    }
                    isMulti
                    name="books"
                    options={books?.map((book) => ({
                      value: book.id,
                      label: book.title,
                    }))}
                    // closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    unstyled
                    styles={{
                      input: (base) => ({
                        ...base,
                        "input:focus": {
                          boxShadow: "none",
                        },
                      }),
                      // On mobile, the label will truncate automatically, so we want to
                      // override that behaviour.
                      multiValueLabel: (base) => ({
                        ...base,
                        whiteSpace: "normal",
                        overflow: "visible",
                      }),
                      control: (base) => ({
                        ...base,
                        transition: "none",
                      }),
                    }}
                    classNames={{
                      control: ({ isFocused }) =>
                        clsx(
                          isFocused
                            ? controlStyles.focus
                            : controlStyles.nonFocus,
                          controlStyles.base
                        ),
                      placeholder: () => placeholderStyles,
                      input: () => selectInputStyles,
                      valueContainer: () => valueContainerStyles,
                      singleValue: () => singleValueStyles,
                      multiValue: () => multiValueStyles,
                      multiValueLabel: () => multiValueLabelStyles,
                      multiValueRemove: () => multiValueRemoveStyles,
                      indicatorsContainer: () => indicatorsContainerStyles,
                      clearIndicator: () => clearIndicatorStyles,
                      indicatorSeparator: () => indicatorSeparatorStyles,
                      dropdownIndicator: () => dropdownIndicatorStyles,
                      menu: () => menuStyles,
                      groupHeading: () => groupHeadingStyles,
                      option: ({ isFocused, isSelected }) =>
                        clsx(
                          isFocused && optionStyles.focus,
                          isSelected && optionStyles.selected,
                          optionStyles.base
                        ),
                      noOptionsMessage: () => noOptionsMessageStyles,
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a buyer</FormLabel>
                <FormControl>
                  <ReactSelect
                    onChange={(value) => {
                      if (value) {
                        form.setValue("userId", value.value, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    onBlur={() => {
                      form.trigger("userId");
                    }}
                    defaultValue={{
                      value: form.getValues()["userId"],
                      label: users?.find(
                        (user) => user.id === form.getValues()["userId"]
                      )?.name,
                    }}
                    name="users"
                    options={users?.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Price</FormLabel>
                <FormControl>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="eg. 100.00"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 flex justify-end">
            <Button type="submit" size={"lg"} loading={status === "pending"}>
              {isEdit ? "Edit Purchase" : "Create Purchase"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
