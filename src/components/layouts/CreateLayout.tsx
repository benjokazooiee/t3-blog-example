import { type ReactElement } from "react";
import { type NextPageWithLayout } from "~/pages/_app";
import ParentLayout from "./ParentLayout";
import DashboardLayout from "./DashboardLayout";

export const createParentLayout = (layoutPage: NextPageWithLayout) => {
    return layoutPage.getLayout = function getLayout(page: ReactElement) {
        return (
          <ParentLayout>
              {page}        
          </ParentLayout>
        )
      }
  }

export const createDashboardLayout = (layoutPage: NextPageWithLayout) => {
  return layoutPage.getLayout = function getLayout(page: ReactElement) {
    return (
      <ParentLayout>
          <DashboardLayout>{page}</DashboardLayout>        
      </ParentLayout>
    )
  }
}