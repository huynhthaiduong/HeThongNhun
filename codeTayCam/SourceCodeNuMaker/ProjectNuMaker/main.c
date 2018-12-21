#include <stdio.h>
#include "NUC131.h"


#define PLL_CLOCK   50000000

#define RXBUFSIZE   1024

#define up 					(1<<3)
#define left 				(1<<2)
#define down 				(1<<1)
#define right 			(1<<0)
#define ADCJT_min		500
#define ADCJT_max		3500

/*---------------------------------------------------------------------------------------------------------*/
/* Global variables                                                                                        */
/*---------------------------------------------------------------------------------------------------------*/
uint8_t g_u8RecData[RXBUFSIZE]  = {0};
uint16_t g_indexRecData = 0;

volatile char controlWord;

/*---------------------------------------------------------------------------------------------------------*/
/* Define functions prototype                                                                              */
/*---------------------------------------------------------------------------------------------------------*/
int32_t main(void);
void UART_TEST_HANDLE(void);
void UART_FunctionTest(void);


void SYS_Init(void)
{
	/*---------------------------------------------------------------------------------------------------------*/
	/* Init System Clock                                                                                       */
	/*---------------------------------------------------------------------------------------------------------*/

	/* Enable Internal RC 22.1184MHz clock */
	CLK_EnableXtalRC(CLK_PWRCON_OSC22M_EN_Msk);

	/* Waiting for Internal RC clock ready */
	CLK_WaitClockReady(CLK_CLKSTATUS_OSC22M_STB_Msk);

	/* Switch HCLK clock source to Internal RC and HCLK source divide 1 */
	CLK_SetHCLK(CLK_CLKSEL0_HCLK_S_HIRC, CLK_CLKDIV_HCLK(1));

	/* Enable external XTAL 12MHz clock */
	CLK_EnableXtalRC(CLK_PWRCON_XTL12M_EN_Msk);

	/* Waiting for external XTAL clock ready */
	CLK_WaitClockReady(CLK_CLKSTATUS_XTL12M_STB_Msk);

	/* Set core clock as PLL_CLOCK from PLL */
	CLK_SetCoreClock(PLL_CLOCK);

	/* Enable UART module clock */
	CLK_EnableModuleClock(UART0_MODULE);
	
	/* Enable ADC module clock */
	CLK_EnableModuleClock(ADC_MODULE);

	/* Select UART module clock source */
	CLK_SetModuleClock(UART0_MODULE, CLK_CLKSEL1_UART_S_HXT, CLK_CLKDIV_UART(1));
	
	/* ADC clock source is 22.1184MHz, set divider to 7, ADC clock is 22.1184/7 MHz */
	CLK_SetModuleClock(ADC_MODULE, CLK_CLKSEL1_ADC_S_HIRC, CLK_CLKDIV_ADC(7));

	/*---------------------------------------------------------------------------------------------------------*/
	/* Init I/O Multi-function                                                                                 */
	/*---------------------------------------------------------------------------------------------------------*/

	/* Set GPB multi-function pins for UART0 RXD(PB.0) and TXD(PB.1) */
	SYS->GPB_MFP &= ~(SYS_GPB_MFP_PB0_Msk | SYS_GPB_MFP_PB1_Msk);
	SYS->GPB_MFP |= SYS_GPB_MFP_PB0_UART0_RXD | SYS_GPB_MFP_PB1_UART0_TXD;
	
	/* Disable the GPA0 - GPA3 digital input path to avoid the leakage current. */
	GPIO_DISABLE_DIGITAL_PATH(PA, 0x03);

	/* Configure the GPA0 - GPA2 ADC analog input pins */
	SYS->GPA_MFP &= ~(SYS_GPA_MFP_PA0_Msk | SYS_GPA_MFP_PA1_Msk);
	SYS->GPA_MFP |= SYS_GPA_MFP_PA0_ADC0 | SYS_GPA_MFP_PA1_ADC1 ;
}
void UART0_Init()
{
	/*---------------------------------------------------------------------------------------------------------*/
	/* Init UART                                                                                               */
	/*---------------------------------------------------------------------------------------------------------*/
	/* Reset UART0 module */
	SYS_ResetModule(UART0_RST);

	/* Configure UART0 and set UART0 Baudrate */
	UART_Open(UART0, 115200);
	
	/* Enable Interrupt and install the call back function */
//  UART_EnableInt(UART0, UART_IER_RDA_IEN_Msk);
}
void GPIO_Init()
{
	/* Configure PA.2 as Input mode and enable interrupt by rising edge trigger */
//	GPIO_SetMode(PA, BIT2, GPIO_PMD_INPUT);
//	GPIO_EnableInt(PA, 2, GPIO_INT_RISING);
//	NVIC_EnableIRQ(GPAB_IRQn);
	
	/* Configure PA.2 as Input mode and enable interrupt by rising edge trigger */
	GPIO_SetMode(PB, BIT11, GPIO_PMD_INPUT);
	GPIO_EnableInt(PB, 11, GPIO_INT_FALLING);
	NVIC_EnableIRQ(GPAB_IRQn);
	
	/* Enable interrupt de-bounce function and select de-bounce sampling cycle time is 1024 clocks of LIRC clock */
	GPIO_SET_DEBOUNCE_TIME(GPIO_DBCLKSRC_LIRC, GPIO_DBCLKSEL_128);
//	GPIO_ENABLE_DEBOUNCE(PA, BIT2);
	GPIO_ENABLE_DEBOUNCE(PB, BIT11);
}
void uartSend(uint8_t c) 
{
	while((UART0->FSR & UART_FSR_TE_FLAG_Msk) == 0);
	UART0->THR = c;
}
/*---------------------------------------------------------------------------------------------------------*/
/*                                                                                                         */
/*  NUMAKER 131                                                                                            */
/* 																						                                                             */
/*---------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------------*/
/* MAIN function                                                                                           */
/*---------------------------------------------------------------------------------------------------------*/

int main(void)
{
    /* Unlock protected registers */
    SYS_UnlockReg();

    /* Init System, peripheral clock and multi-function I/O */
    SYS_Init();

    /* Lock protected registers */
    SYS_LockReg();

    /* Init UART0 for printf and testing */
    UART0_Init();
		
		/* */
		GPIO_Init();

    /*---------------------------------------------------------------------------------------------------------*/
    /* SAMPLE CODE                                                                                             */
    /*---------------------------------------------------------------------------------------------------------*/

    printf("\n\nCPU @ %dHz\n", SystemCoreClock);
		
    int32_t JT_X, JT_Y;
		
    while(1) {
			CLK_SysTickLongDelay(500000);
			
			/* Set the ADC operation mode as single-cycle, input mode as single-end and
					 enable the analog input channel 0, 1, 2 and 3 */
			ADC_Open(ADC, ADC_ADCR_DIFFEN_SINGLE_END, ADC_ADCR_ADMD_SINGLE_CYCLE, 0x03);

			/* Power on ADC module */
			ADC_POWER_ON(ADC);

			/* Clear the A/D interrupt flag for safe */
			ADC_CLR_INT_FLAG(ADC, ADC_ADF_INT);

			/* Start A/D conversion */
			ADC_START_CONV(ADC);

			/* Wait conversion done */
			while(!ADC_GET_INT_FLAG(ADC, ADC_ADF_INT));
			
			JT_X = ADC_GET_CONVERSION_DATA(ADC, 1);
			JT_Y = ADC_GET_CONVERSION_DATA(ADC, 0);
			
			/* Disable ADC module */
			ADC_Close(ADC);
			
			controlWord = (JT_X < ADCJT_min && JT_Y < ADCJT_min)? '1':
				(JT_X < ADCJT_min && JT_Y > ADCJT_max)? '7':
				(JT_X > ADCJT_max && JT_Y < ADCJT_min)? '3':
				(JT_X > ADCJT_max && JT_Y > ADCJT_max)? '9':
				(JT_X < ADCJT_min)? '4': (JT_X > ADCJT_max)? '6': (JT_Y < ADCJT_min)? '2': (JT_Y > ADCJT_max)? '8': '_';
			
			if (controlWord != '_')
				printf("~%c\r\n", controlWord);
			
		}
}

/**
 * @brief       GPIO PA/PB IRQ
 * @details     The PA/PB default IRQ, declared in startup_NUC131.s.
 */
void GPAB_IRQHandler(void)
{	
	/* To check if PB.11 interrupt occurred */
	if(GPIO_GET_INT_FLAG(PB, BIT11))
	{
			GPIO_CLR_INT_FLAG(PB, BIT11);
			controlWord = 'c';
			printf("~%c\r\n", controlWord);
	}
}
