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
 * @link    https://github.com/${composer.name}
 */

namespace ${action.namespace};

use AppserverIo\Routlt\DispatchAction;
use AppserverIo\Routlt\ActionInterface;
use AppserverIo\Psr\Servlet\Http\HttpServletRequestInterface;
use AppserverIo\Psr\Servlet\Http\HttpServletResponseInterface;
use ${util.namespace}\RequestKeys;

/**
 * Default action implementation.
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/${composer.name}
 *
 * @Path(name="/index")
 *
 * @Results({
 *     @Result(name="input", result="/index.dhtml", type="AppserverIo\Routlt\Results\ServletDispatcherResult")
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
     *
     * @Action(name="/index")
     */
    public function indexAction(HttpServletRequestInterface $servletRequest, HttpServletResponseInterface $servletResponse)
    {

        try {
            // append the Rout.Lt 2 version to the request attributes
            $servletRequest->setAttribute(RequestKeys::ROUTLT_VERSION, '${routlt.version}');

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
