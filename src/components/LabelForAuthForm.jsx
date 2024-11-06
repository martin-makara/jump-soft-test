const LabelForAuthForm = ({ errorName, errorText, labelText, inputType, placeholder, name, func, icon }) => {
	return (
		<>
			<label className={"input-group border rounded mb-2" + (errorName ? " border-danger" : " border-color")}>
				{icon && (
					<span className="input-group-text border-0 bg-transparent" id={`${name}-addon`}>
						{icon}
					</span>
				)}
				<input
					type={inputType}
					className="form-control border-0 bg-transparent p-2 custom-input"
					placeholder={placeholder}
					aria-label={labelText}
					aria-describedby={`${name}-addon`}
					{...func(name)}
				/>
			</label>
			{errorName && <span>{errorText}</span>}
		</>
	);
};

export default LabelForAuthForm;
