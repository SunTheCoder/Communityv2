import React, { useState } from "react";
import { supabase } from "./SignUp";
import { Field } from "./ui/field"
import {  SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText } from "./ui/select";
import { Button } from "./ui/button";
import { Input, Stack, Textarea, Box, createListCollection } from "@chakra-ui/react";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri"
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
  } from "./ui/drawer";
import { CloseButton } from "./ui/close-button";
import { useForm } from 'react-hook-form';


const formValues = {
    resourceName: "",
    zipCode: "",
  };

const AddResourceDrawer = () => {
    // const { register, handleSubmit, formState: { errors } } = useForm();
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    //   } = useForm<FormValues>()
    const { register, handleSubmit } = useForm();

    
    const onSubmit = (data) => {
        console.log('Form Data:', data);
      };
    
    return (
                    <form onSubmit={handleSubmit(onSubmit)}>
    <DrawerRoot size="sm" >
        <DrawerBackdrop />
        <DrawerTrigger asChild>
            <Button variant="outline">
                Add Resource <RiArrowRightLine/>
            </Button>
        </DrawerTrigger>
        <DrawerContent 
            borderLeftRadius="lg" 
            overflow="hidden" 
            p={4} 
            width="full"   
            align="center"
            justify="center"
            >

            <DrawerCloseTrigger>
                <CloseButton />
            </DrawerCloseTrigger>
            <DrawerHeader>
            <DrawerTitle>
                Add Resource
            </DrawerTitle>
            </DrawerHeader>
            <DrawerBody />
                    <Stack
                        spacing={4}
                        // width="full"
                        // align="center"
                        // justify="center"
                        py={12} 
                        // px={6}
                    >
                         <Field
                            label="Name"
                            helperText="This field is required"
                            errorText="Error: Resource Name is required"
                            required
                            >
                            <Input
                                type="text"
                                placeholder="ex. Thuggin' Fridge"
                                {...register("resourceName", { required: true })}
                            
                            />
                           
                        </Field>

                        <Field
                            label="ZipCode"
                            helperText="This field is required"
                            errorText="Error: ZipCode is required"
                            required
                            >
                            <Input
                                type="text"
                                placeholder="ex. 23187"
                                {...register("resourceName", { required: true })}
                            
                            />
                           
                        </Field>
                    </Stack>
            <DrawerFooter  />
                <Button type="submit" variant="solid" >
                    Submit <RiArrowRightLine/>
                </Button>
        </DrawerContent>
    </DrawerRoot>
                    </form>
    )
}

export default AddResourceDrawer;