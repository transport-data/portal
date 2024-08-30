import MultipleSelector from "@components/_shared/ChipsInput";
import TextDivisor from "@components/_shared/TextDivisor";
import TextEditor from "@components/_shared/TextEditor";

export default ({
  setEmailsToInvite,
  setEmailValidationErrorMessage,
  emailValidationErrorMessage,
  emailsToInvite,
  setMessageToInvitation,
}: {
  setEmailsToInvite: any;
  setMessageToInvitation: any;
  emailValidationErrorMessage: string;
  setEmailValidationErrorMessage: any;
  emailsToInvite: any;
}) => {
  return (
    <div className="space-y-5">
      <h2 className="mb-2.5 text-xl font-bold text-[#111928]">
        Invite friends & colleagues
      </h2>

      <div className="space-y-4">
        <TextDivisor text="Emails*" />
        <MultipleSelector
          removeSuggestions
          hidePlaceholderWhenSelected
          transformInputValueInLowercase
          onChange={(x) => setEmailsToInvite(new Set(x))}
          inputProps={{
            className:
              "border-0 text-[#111928] ring-0 border-[#00000000] lowercase",
          }}
          badgeClassName="px-3 py-[2px] hover:opacity:90 hover:bg-[#E3F9ED] rounded-md text-[#006064] overflow-wrap-anywhere
          inline-flex items-center border font-semibold
          "
          placeholder="name1@email.com; name2@email.com;"
          creatable
          validationOptions={{
            errorMessage: emailValidationErrorMessage,
            isDataValid: (v) => {
              if (!!v && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)) {
                setEmailValidationErrorMessage("Invalid email");
                return (
                  !!v && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)
                );
              }
              if (
                Array.from(emailsToInvite.values()).some(
                  (x: any) => x.value === v
                )
              ) {
                setEmailValidationErrorMessage("Email already present");
                return true;
              }

              return false;
            },
          }}
          triggerSearchOnFocus={false}
          className="mail-icon-at-left pl-11 pr-4"
          hideClearAllButton
        />
      </div>
      <TextDivisor text="Attach a message" />
      <TextEditor
        placeholder="Message for friends and colleagues..."
        setText={setMessageToInvitation}
      />
    </div>
  );
};
