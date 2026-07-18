import type { RootState, AppDispatch } from "./store";
import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const UseAppDispatch = () => useDispatch<AppDispatch>();

// useSelector ek fn hai jo callback leta hai uske parameter i.e, state ka type set krna pdta hai i.e, RootState
//useDispatch ek generic fn hai jiske return type ke type ko set krna pdta isliye use call krke generic type set krna hota hai
