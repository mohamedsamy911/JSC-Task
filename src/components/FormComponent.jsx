import "./FormComponent.css";
import { Controller, useForm } from "react-hook-form";
import { Select } from "antd";
import { useEffect } from "react";

function FormComponent({ onSubmit, onClick, formVisible, x, y }) {
  // Initialize useForm to manage form state
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Set the x, y values when they are sent from the MapComponent and manually recheck the form validation
  useEffect(() => {
    setValue("x", x);
    setValue("y", y);
    if ((x, y)) {
      trigger(["x", "y"]);
    }
  }, [x, y]);

  // Filter function for options in Select dropdown
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleFormSubmit = (data) => {
    onSubmit(data); // Call onSubmit function passed as prop
    reset(); // Reset the form after submission
    setValue("x", ""); //reset x field after submission
    setValue("y", ""); //reset y field after submission
  };
  return (
    <div
      style={{
        width: formVisible ? "20%" : "0%",
        border: !formVisible && "none",
      }}
      className="form-container"
    >
      {/* Form for submitting feedback */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
        {/* Form header */}
        <div className="form-header">
          <h2 style={{ fontWeight: "bold", display: "inline" }}>
            New Feedback
          </h2>
          {/* Button to toggle form container visibility */}
          <div style={{ cursor: "pointer" }} onClick={onClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              className="svg-icon"
            >
              <path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z" />
            </svg>
          </div>
        </div>

        {/* Input field for Name */}
        <input
          style={{
            width: "70%",
            borderRadius: "6px",
            border: errors.name ? "1px solid red" : "none",
          }}
          {...register("name", {
            required: "Please insert your name",
          })}
          type="text"
          placeholder="Name"
        />
        {errors?.name && (
          <span style={{ color: "red", bottom: "25px" }}>
            {errors.name.message}
          </span>
        )}

        {/* Input field for Email */}
        <input
          style={{
            width: "70%",
            borderRadius: "6px",
            border: errors.name ? "1px solid red" : "none",
            marginTop: "10px",
          }}
          {...register("email", {
            required: "Please insert your E-mail",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="text"
          placeholder="Email"
        />
        {errors?.email && (
          <span style={{ color: "red", bottom: "25px" }}>
            {errors.email.message}
          </span>
        )}

        {/* Select dropdown for Feedback Type */}
        <Controller
          control={control}
          name="feedbackType"
          rules={{
            required: "Please select type of feedback",
          }}
          render={({ field }) => {
            return (
              <Select
                style={{ width: "70%", marginTop: "10px", height: "38px" }}
                status={errors.feedbackType ? "error" : null}
                showSearch
                placeholder="Select Type of feedback"
                optionFilterProp="children"
                filterOption={filterOption}
                value={field.value ? field.value : null}
                onChange={(feedback) => {
                  field.onChange(feedback ? feedback : null);
                }}
                options={[
                  { value: "complain", label: "Complain" },
                  { value: "requestInformation", label: "Request Information" },
                  { value: "missedServices", label: "Missed Services" },
                  { value: "addInformation", label: "Add Information" },
                  { value: "other", label: "Other" },
                ]}
              />
            );
          }}
        />
        {errors.feedbackType && (
          <span style={{ color: "red" }}>{errors.feedbackType.message}</span>
        )}

        {/* Textarea for Message */}
        <textarea
          {...register("message", {
            required: "Please insert a message",
          })}
          rows="4"
          cols="50"
          placeholder="Message"
          style={{
            width: "70%",
            borderRadius: "6px",
            border: errors.message ? "1px solid red" : "none",
            marginTop: "10px",
          }}
        />
        {errors?.message && (
          <span style={{ color: "red", bottom: "25px" }}>
            {errors.message.message}
          </span>
        )}

        {/* Container for X and Y coordinates */}
        <div className="coo-container">
          {/* Input for X coordinate */}
          <input
            defaultValue={x ? x : ""}
            readOnly
            style={{
              width: "30%",
              borderRadius: "6px",
              border: errors.x ? "1px solid red" : "none",
              marginTop: "10px",
            }}
            {...register("x", {
              required: "Please click on the map to add coordinate",
            })}
            type="text"
            placeholder="X"
          />

          {/* Input for Y coordinate */}
          <input
            defaultValue={y ? y : ""}
            readOnly
            style={{
              width: "30%",
              borderRadius: "6px",
              border: errors?.x ? "1px solid red" : "none",
              marginTop: "10px",
            }}
            {...register("y", {
              required: "Please click on the map to add coordinate",
            })}
            type="text"
            placeholder="y"
          />
        </div>
        {(errors?.x || errors?.y) && (
          <span style={{ color: "red", bottom: "25px" }}>
            {errors?.x?.message}
          </span>
        )}

        {/* Submit button */}
        <button type="submit" className="btn btn-white">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormComponent;
