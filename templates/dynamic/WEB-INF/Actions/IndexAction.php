<?php

/**
 * ${action.namespace}\IndexAction
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * PHP version 5
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/appserver-io/routlt-project
 */

namespace ${action.namespace};

use AppserverIo\Routlt\DispatchAction;

/**
 * Default login action implementation.
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/appserver-io/routlt-project
 *
 * @Results({
 *     @Result(name="input", result="/phtml/index.phtml", type="AppserverIo\Routlt\Results\ServletDispatcherResult")
 * })
 */
class IndexAction extends DispatchAction
{

    /**
     * Default action to invoke if no action parameter has been found in the request.
     *
     * @param \AppserverIo\Psr\Servlet\Http\HttpServletRequestInterface  $servletRequest  The request instance
     * @param \AppserverIo\Psr\Servlet\Http\HttpServletResponseInterface $servletResponse The response instance
     *
     * @return string|null The action result
     */
    public function indexAction(HttpServletRequestInterface $servletRequest, HttpServletResponseInterface $servletResponse)
    {

        try {
            // action invocation has been successfull
            return ActionInterface::INPUT;

        } catch (\Exception $e) {
            // append the exception the response body
            $this->addFieldError('critical', $e->getMessage());

            // action invocation has been successfull
            return ActionInterface::INPUT;
        }
    }
}
